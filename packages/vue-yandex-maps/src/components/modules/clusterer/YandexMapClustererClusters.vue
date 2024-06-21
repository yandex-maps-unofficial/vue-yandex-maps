<script lang="ts">
import type { ComputedRef, PropType, SlotsType, VNode } from 'vue';
import { computed, defineComponent, h, inject, nextTick } from 'vue';
import type { IYMapClusterFeature, YandexMapClustererZoomOptionsObject } from './YandexMapClusterer.vue';
import { excludeYandexMarkerProps, getMarkerContainerProps } from '../../../utils/marker.ts';
import type { LngLatBounds, YMapMarker } from '@yandex/ymaps3-types';
import { hF, sleep } from '../../../utils/system.ts';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';
import type { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import { injectMap } from '../../../utils/map.ts';
import { getBoundsFromCoords, getLocationFromBounds } from '../../../functions';

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
    slots: Object as SlotsType<{
        default: {
            clusterer: ClustererObject;
            coordinates: ClustererObject['lnglat'];
            length: number;
        };
    }>,
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
                }, index) => hF([
                    h(
                        'div',
                        {
                            ...containerProps.value.root,
                            ref: async _item => {
                                if (!_item) return;
                                const item = _item as HTMLDivElement;
                                if (element.children.length) {
                                    element.children.forEach(x => {
                                        try {
                                            element.removeChild(x);
                                        }
                                        catch (e) {
                                            console.warn('Non-fatal error occurred when updating Map clusterer', e);
                                        }
                                    });
                                }

                                await nextTick();

                                try {
                                    element.addChild(new ymaps3.YMapMarker({
                                        ...excludeYandexMarkerProps(props.clusterMarkerProps),
                                        coordinates: clusterer.lnglat,
                                        onClick: async e => {
                                            props.clusterMarkerProps.onClick?.(e);

                                            if (clusterer.features.length >= 2) {
                                                const settings: YandexMapClustererZoomOptionsObject = typeof props.zoomOnClusterClick === 'object' ? props.zoomOnClusterClick : {};

                                                const featuresCoords = clusterer.features.map(x => x.geometry.coordinates);
                                                const bounds: LngLatBounds = getBoundsFromCoords(featuresCoords);
                                                emit('trueBounds', bounds);

                                                if (!props.zoomOnClusterClick) return;

                                                const defaultDuration = settings.duration ?? 500;

                                                if (settings.strategy === 'boundsCorrect') {
                                                    const [[minLongitude, maxLatitude], [maxLongitude, minLatitude]] = bounds;

                                                    const latDiff = maxLatitude - minLatitude;
                                                    const longDiff = maxLongitude - minLongitude;

                                                    const updatedBounds: LngLatBounds = [[minLongitude - longDiff, maxLatitude - latDiff], [maxLongitude + longDiff, minLatitude + latDiff]];
                                                    emit('updatedBounds', updatedBounds);

                                                    map.value?.setLocation({
                                                        bounds: updatedBounds,
                                                        duration: defaultDuration,
                                                        easing: settings.easing,
                                                    });
                                                }
                                                else {
                                                    const { center, zoom } = await getLocationFromBounds({
                                                        bounds,
                                                        map: map.value!,
                                                        roundZoom: true,
                                                        comfortZoomLevel: true,
                                                    });

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
                                }
                                catch (e) {
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
                    ),
                ], {
                    key: clusterer.clusterId + clusterer.features.length,
                }));

            return hF(clusterSlots);
        };
    },
});
</script>
