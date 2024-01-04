<script lang="ts">
import type {
  PropType, Ref, SlotsType, VNode,
} from 'vue';
import {
  computed, defineComponent, h, nextTick, onMounted, ref, shallowRef, watch,
} from 'vue';
import type { clusterByGrid, Feature, YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';
import type {
  LngLatBounds, YMapCollection, YMapEntity, YMapMarker,
} from '@yandex/ymaps3-types';
import type { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import { sleep, throwException } from '../../../composables/utils/system.ts';
import { setupMapChildren } from '../../../composables/utils/setupMapChildren.ts';
import { excludeYandexMarkerProps, getMarkerContainerProps } from '../../../composables/utils/marker.ts';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';
import { injectMap } from '../../../composables/utils/map.ts';
import type { EasingFunctionDescription } from '@yandex/ymaps3-types/common/types';
import { useYMapsLocationFromBounds } from '../../../composables/getCenterAndZoom.ts';

type Settings = ConstructorParameters<typeof YMapClusterer>[0]
export type YandexMapClustererOptions = Partial<Omit<Settings, 'features' | 'marker' | 'cluster'>>

export type YandexMapClustererZoomOptionsObject = {
  duration?: number
  easing?: EasingFunctionDescription

  /**
   * @description zoomCorrect will apply Math.floor after initial bounds update. boundsCorrect will instead subtract the distance between left top and right bottom coordinates of bounds.
   *
   * If boundsCorrect is active, updated bounds will be returned in updatedBounds event.
   * @default zoomCorrect
   */
  strategy?: 'zoomCorrect' | 'boundsCorrect'

  /**
   * @description By default, if objects are too close to borders, library will add -1 zoom for user's comfort.
   *
   * This can work poor on large grid sizes and/or high density of objects. You can disable behaviour by using this setting.
   */
  disableMinimalZoomCorrectDiff?: boolean
}

export default defineComponent({
  name: 'YandexMapClusterer',
  props: {
    value: {
      type: Object as PropType<YMapClusterer>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapClusterer>,
      default: null,
    },
    settings: {
      type: Object as PropType<YandexMapClustererOptions>,
      default: () => ({}),
    },
    /**
     * @description All custom (non-settings) props are also supported
     */
    clusterMarkerProps: {
      type: Object as PropType<Omit<ConstructorParameters<typeof YMapMarker>[0], 'coordinates'> & YandexMapMarkerCustomProps>,
      default: () => ({}),
    },
    /**
     * @description Size of the grid division in pixels
     *
     * Used in settings.method via Yandex clusterByGrid method
     *
     * @see https://yandex.ru/dev/jsapi30/doc/ru/ref/packages/clusterer/
     * @see https://yandex.ru/dev/jsapi30/doc/en/ref/packages/clusterer/
     */
    gridSize: {
      type: Number,
      default: 64,
    },
    /**
     * @description Zooms to bounds of features of cluster
     */
    zoomOnClusterClick: {
      type: [Boolean, Object] as PropType<boolean | YandexMapClustererZoomOptionsObject>,
      default: false,
    },
  },
  slots: Object as SlotsType<{
    default: {},
    cluster: {
      clusterer: ClustererObject,
      coordinates: ClustererObject['lnglat'],
      length: number,
    },
  }>,
  emits: {
    'input'(item: YMapClusterer): boolean {
      return true;
    },
    'update:modelValue'(item: YMapClusterer): boolean {
      return true;
    },
    // Exact features bounds returned on cluster click
    trueBounds(bounds: LngLatBounds): boolean {
      return bounds.length === 2;
    },
    // Auto-corrected features bounds returned on cluster click
    updatedBounds(bounds: LngLatBounds): boolean {
      return bounds.length === 2;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    const map = injectMap();
    const mapChildren = shallowRef<(Pick<YMapClusterer, 'update'> & Record<string, any>) | null>(null);
    const entities: Ref<(YMapEntity<Pick<YMapMarker, 'coordinates'>>)[]> = shallowRef([]);
    const clusterFeatures = ref<{ clusterer: ClustererObject, element: YMapCollection }[]>([]);

    let _clusterByGrid: typeof clusterByGrid | undefined;

    const tickTimeout = computed(() => props.settings.tickTimeout ?? 200);

    const getSettings = computed<Settings>(() => {
      const settings = { ...props.settings } as Settings;
      if (!settings.method && _clusterByGrid) settings.method = _clusterByGrid?.({ gridSize: props.gridSize });
      settings.tickTimeout = tickTimeout.value;

      const marker: Settings['marker'] = (feature: Feature) => {
        const entity = entities.value.find((x: Record<string, any>) => x._props.id === feature.id);

        if (!entity) {
          throwException({
            text: `No entity with id ${feature.id} (coordinates: ${feature.geometry.coordinates.join(', ')}) were found in YandexMapClusterer.`,
            isInternal: true,
            warn: true,
          });
          return new ymaps3.YMapMarker({ coordinates: feature.geometry.coordinates });
        }

        return entity;
      };

      const cluster: Settings['cluster'] = (coordinates) => {
        const foundCluster = clusterFeatures.value.find((x) => JSON.stringify(x.clusterer.lnglat) === JSON.stringify(coordinates));

        if (!foundCluster) {
          throwException({
            text: `No element with coordinates of ${coordinates.join(', ')} were found in YandexMapClusterer.`,
            isInternal: true,
            warn: true,
          });
          return new ymaps3.YMapMarker({ coordinates });
        }

        return foundCluster.element as YMapMarker;
      };

      const features: Settings['features'] = entities.value.map((entity: Record<string, any>, i) => {
        if (!entity._props.id) {
          entity.update({
            id: Math.random()
              .toString() + Date.now()
              .toString(),
          });
        }

        return {
          type: 'Feature',
          id: entity._props.id,
          geometry: {
            type: 'Point',
            coordinates: entity._props.coordinates,
          },
          properties: 'properties' in entity._props ? entity._props.properties : {},
        };
      });

      settings.onRender = (clustersList) => {
        clusterFeatures.value = clustersList.map((clusterer) => ({
          clusterer,
          element: clusterFeatures.value.find((x) => x.clusterer.clusterId === clusterer.clusterId)?.element || new ymaps3.YMapCollection({}),
        }));

        if (props.settings.onRender) return props.settings.onRender(clustersList);
      };

      return {
        ...settings,
        marker,
        features,
        cluster,
      };
    });

    const update = async () => {
      await nextTick();
      mapChildren.value?.update(getSettings.value);
      mapChildren.value?._render();

      setTimeout(() => mapChildren.value?._render(), tickTimeout.value);
    };

    watch(() => [props.settings, props.gridSize], () => {
      update();
    }, {
      deep: true,
    });

    const init = async () => {
      mapChildren.value = await setupMapChildren({
        createFunction: ({
          YMapClusterer: Clusterer,
          clusterByGrid: _clusterByGrid_,
        }) => {
          _clusterByGrid = _clusterByGrid_;
          return new Clusterer(getSettings.value);
        },
        requiredImport: () => ymaps3.import('@yandex/ymaps3-clusterer@0.0.1'),
        isMapRoot: true,
        mapRootRef: entities,
      });

      emit('input', mapChildren.value as YMapClusterer);
      emit('update:modelValue', mapChildren.value as YMapClusterer);
    };

    watch(entities, async () => {
      await nextTick();
      update();
    });

    onMounted(() => {
      init();
    });

    return () => {
      if (!mapChildren.value) return h('div');

      const features = clusterFeatures.value.filter((x) => x.clusterer.features.length > 1);

      const containerProps = getMarkerContainerProps({
        position: props.clusterMarkerProps?.position ?? 'top-center left-center',
        containerAttrs: props.clusterMarkerProps?.containerAttrs,
        wrapperAttrs: props.clusterMarkerProps?.wrapperAttrs,
        zeroSizes: props.clusterMarkerProps?.zeroSizes,
      });

      const clusterSlots: VNode[] = features
        .map(({
          clusterer,
          element,
        }, index) => h(
          'div',
          {
            ...containerProps.root,
            key: `${clusterer.clusterId}_${index}_${clusterer.features.length}_${clusterer.lnglat.join(',')}`,
            ref: async (item) => {
              if (!item) return;

              await nextTick();

              try {
                element.children.forEach((x) => element.removeChild(x as any));

                element.addChild(new ymaps3.YMapMarker({
                  ...excludeYandexMarkerProps(props.clusterMarkerProps),
                  coordinates: clusterer.lnglat,
                  onClick: async (e) => {
                    props.clusterMarkerProps.onClick?.(e);

                    if (clusterer.features.length >= 2) {
                      const {
                        minLongitude,
                        minLatitude,
                        maxLongitude,
                        maxLatitude,
                      } = clusterer.features.map((x) => x.geometry.coordinates)
                        .reduce(
                          (acc, [longitude, latitude]) => ({
                            minLongitude: Math.min(acc.minLongitude, longitude),
                            minLatitude: Math.min(acc.minLatitude, latitude),
                            maxLongitude: Math.max(acc.maxLongitude, longitude),
                            maxLatitude: Math.max(acc.maxLatitude, latitude),
                          }),
                          {
                            minLongitude: Infinity,
                            minLatitude: Infinity,
                            maxLongitude: -Infinity,
                            maxLatitude: -Infinity,
                          },
                        );

                      const settings: YandexMapClustererZoomOptionsObject = typeof props.zoomOnClusterClick === 'object' ? props.zoomOnClusterClick : {};

                      const bounds: LngLatBounds = [[minLongitude, maxLatitude], [maxLongitude, minLatitude]];
                      emit('trueBounds', bounds);

                      if (!props.zoomOnClusterClick) return;

                      const defaultDuration = settings.duration ?? 500;

                      if (settings.strategy === 'boundsCorrect') {
                        const latDiff = maxLatitude - minLatitude;
                        const longDiff = maxLongitude - minLongitude;

                        const updatedBounds: LngLatBounds = [[minLongitude - longDiff, maxLatitude - latDiff], [maxLongitude + longDiff, minLatitude + latDiff]];
                        emit('updatedBounds', updatedBounds);

                        map.value?.setLocation({
                          bounds: updatedBounds,
                          duration: defaultDuration,
                          easing: settings.easing,
                        });
                      } else {
                        let { center, zoom } = await useYMapsLocationFromBounds({
                          bounds,
                          map: map.value!,
                        });

                        const originalZoom = zoom;
                        zoom = Math.floor(zoom);
                        const diff = originalZoom - zoom;

                        if (!settings.disableMinimalZoomCorrectDiff && diff < 0.5) {
                          // Set minimal zoom diff for user's comfort
                          zoom -= 1;
                        }

                        map.value?.setLocation({
                          center,
                          zoom,
                          duration: defaultDuration,
                          easing: settings.easing,
                        });

                        await sleep(defaultDuration + 50);
                        if (map.value) emit('updatedBounds', map.value.bounds);
                      }
                    }
                  },
                }, item as HTMLDivElement));
              } catch (e) {
                console.error(e);
              }
            },
            attrs: {
              coordinates: JSON.stringify(clusterer.lnglat),
            },
            // @ts-ignore
            coordinates: JSON.stringify(clusterer.lnglat),
          },
          [
            h('div', {
              ...containerProps.children,
            }, slots.cluster?.({
              clusterer,
              coordinates: clusterer.lnglat,
              length: clusterer.features.length,
            })),
          ],
        ));

      return h('div', [
        ...slots.default?.({}) || [],
        h('div', {
          key: features.map((x) => x.clusterer.clusterId)
            .join(','),
        }, [clusterSlots]),
      ]);
    };
  },
});
</script>
