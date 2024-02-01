<script lang="ts">
import {
  computed,

  defineComponent, h, inject, nextTick,
} from 'vue';
import type {
  ComputedRef, PropType, SlotsType, VNode,
} from 'vue';
import type { IYMapClusterFeature, YandexMapClustererZoomOptionsObject } from './YandexMapClusterer.vue';
import { excludeYandexMarkerProps, getMarkerContainerProps } from '../../../composables/utils/marker.ts';
import type { LngLatBounds, YMapMarker } from '@yandex/ymaps3-types';
import { useYMapsLocationFromBounds } from '../../../composables';
import { sleep } from '../../../composables/utils/system.ts';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';
import type { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import { injectMap } from '../../../composables/utils/map.ts';

export default defineComponent({
  name: 'YandexMapClustererClusters',
  props: {
    clusterMarkerProps: {
      type: Object as PropType<Omit<ConstructorParameters<typeof YMapMarker>[0], 'coordinates'> & YandexMapMarkerCustomProps>,
      default: () => ({}),
    },
    zoomOnClusterClick: {
      type: [Boolean, Object] as PropType<boolean | YandexMapClustererZoomOptionsObject>,
      default: false,
    },
  },
  slots: Object as SlotsType<{
    default: {
      clusterer: ClustererObject,
      coordinates: ClustererObject['lnglat'],
      length: number,
    },
  }>,
  emits: {
    // Exact features bounds returned on cluster click
    trueBounds(bounds: LngLatBounds): boolean {
      return bounds.length === 2;
    },
    // Auto-corrected features bounds returned on cluster click
    updatedBounds(bounds: LngLatBounds): boolean {
      return bounds.length === 2;
    },
  },
  setup(props, { slots, emit }) {
    const map = injectMap();
    const features = inject<ComputedRef<IYMapClusterFeature[]>>('clusterFeatures');

    const containerProps = computed(() => getMarkerContainerProps({
      position: props.clusterMarkerProps?.position ?? 'top-center left-center',
      containerAttrs: props.clusterMarkerProps?.containerAttrs,
      wrapperAttrs: props.clusterMarkerProps?.wrapperAttrs,
      zeroSizes: props.clusterMarkerProps?.zeroSizes,
    }));

    return () => {
      const clusterSlots: VNode[] = features!.value
        .map(({
          clusterer,
          element,
        }, index) => h(
          'div',
          {
            ...containerProps.value.root,
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
          },
          [
            h('div', {
              ...containerProps.value.children,
            }, slots.default?.({
              clusterer,
              coordinates: clusterer.lnglat,
              length: clusterer.features.length,
            })),
          ],
        ));

      return h('div', {
        key: features!.value.map((x) => x.clusterer.clusterId)
          .join(','),
      }, [clusterSlots]);
    };
  },
});
</script>
