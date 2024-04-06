<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import {
  computed, defineComponent, h, nextTick, onMounted, provide, shallowRef, watch, version,
} from 'vue';
import type { clusterByGrid, Feature, YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';
import type {
  LngLatBounds, YMapCollection, YMapEntity, YMapMarker,
} from '@yandex/ymaps3-types';
import type { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import { isVue2, throwException } from '../../../utils/system.ts';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';
import type { EasingFunctionDescription } from '@yandex/ymaps3-types/common/types';
import YandexMapClustererClusters from './YandexMapClustererClusters.vue';

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
   * This can work poor on large grid sizes and/or high density of objects. You can disable behavior by using this setting.
   */
  disableMinimalZoomCorrectDiff?: boolean
}

export interface IYMapClusterFeature {
  clusterer: ClustererObject,
  element: YMapCollection
}

export default defineComponent({
  name: 'YandexMapClusterer',
  props: {
    value: {
      type: Object as PropType<YMapClusterer | null>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapClusterer | null>,
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
    const mapChildren = shallowRef<(Pick<YMapClusterer, 'update'> & Record<string, any>) | null>(null);
    const entities = shallowRef<(YMapEntity<Pick<YMapMarker, 'coordinates'>>)[]>([]);
    const clusterFeatures = shallowRef<IYMapClusterFeature[]>([]);

    const filteredFeatures = computed(() => clusterFeatures.value.filter((x) => x.clusterer.features.length > 1));
    provide('clusterFeatures', filteredFeatures);

    let _clusterByGrid: typeof clusterByGrid | undefined;

    const tickTimeout = computed(() => props.settings.tickTimeout);

    const getSettings = () => {
      const settings = { ...props.settings } as Settings;
      if (!settings.method && _clusterByGrid) settings.method = _clusterByGrid?.({ gridSize: props.gridSize });
      if (tickTimeout.value) settings.tickTimeout = tickTimeout.value;

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
        const foundCluster = clusterFeatures.value.find((x) => x.clusterer.lnglat[0] === coordinates[0] && x.clusterer.lnglat[1] === coordinates[1]);

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
    };

    const update = async () => {
      await nextTick();
      mapChildren.value?.update(getSettings());
      mapChildren.value?._render();
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
          return new Clusterer(getSettings());
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

      if (isVue2()) {
        return h('div', [
          ...slots.default?.({}) || [],
          h(YandexMapClustererClusters, {
            props: {
              clusterMarkerProps: props.clusterMarkerProps,
              zoomOnClusterClick: props.zoomOnClusterClick,
            },
            on: {
              trueBounds: (e: LngLatBounds) => emit('trueBounds', e),
              updatedBounds: (e: LngLatBounds) => emit('updatedBounds', e),
            },
            scopedSlots: {
              default: (options: any) => h('div', {}, [slots.cluster?.(options)]),
            },
          }),
        ]);
      }
      return h('div', [
        ...slots.default?.({}) || [],
        h(YandexMapClustererClusters, {
          clusterMarkerProps: props.clusterMarkerProps,
          zoomOnClusterClick: props.zoomOnClusterClick,
          onTrueBounds: (e: LngLatBounds) => emit('trueBounds', e),
          onUpdatedBounds: (e: LngLatBounds) => emit('updatedBounds', e),
        }, {
          default: (options: any) => slots.cluster?.(options),
        }),
      ]);
    };
  },
});
</script>
