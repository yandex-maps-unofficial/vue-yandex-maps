<script lang="ts">
import { onUpdated, ref, watch } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, h } from 'vue';
import type { IYMapClusterFeature, YandexMapClustererZoomOptionsObject } from './YandexMapClusterer.vue';
import { excludeYandexMarkerProps, getMarkerContainerProps } from '../../../utils/marker.ts';
import type { LngLatBounds, YMapMarker } from '@yandex/ymaps3-types';
import { hF, sleep } from '../../../utils/system.ts';
import type { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import { injectMap } from '../../../utils/map.ts';
import { getBoundsFromCoords, getLocationFromBounds } from '../../../functions';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';

export default defineComponent({
    name: 'YandexMapClustererCluster',
    props: {
        clusterMarkerProps: {
            type: Object as PropType<Omit<ConstructorParameters<typeof YMapMarker>[0], 'coordinates'> & YandexMapMarkerCustomProps>,
            default: () => ({}),
        },
        zoomOnClusterClick: {
            type: [Boolean, Object] as PropType<boolean | YandexMapClustererZoomOptionsObject>,
            default: false,
        },
        feature: {
            type: Object as PropType<IYMapClusterFeature>,
            required: true,
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
        updatedCluster(clusterId: string) {
            return true;
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
        const element = ref<null | HTMLDivElement>(null);

        const containerProps = computed(() => getMarkerContainerProps({
            position: props.clusterMarkerProps?.position ?? 'top-center left-center',
            containerAttrs: props.clusterMarkerProps?.containerAttrs,
            wrapperAttrs: props.clusterMarkerProps?.wrapperAttrs,
            zeroSizes: props.clusterMarkerProps?.zeroSizes,
        }));

        function updateElement() {
            const _element = element.value;
            if (!_element) return;

            const clusterElement = props.feature.element;
            const clusterer = props.feature.clusterer;

            if (clusterElement.children.length) {
                clusterElement.children.forEach(x => {
                    try {
                        clusterElement.removeChild(x);
                    }
                    catch (e) {
                        console.warn('Non-fatal error occurred when updating Map clusterer', e);
                    }
                });
            }

            try {
                clusterElement.addChild(new ymaps3.YMapMarker({
                    ...excludeYandexMarkerProps(props.clusterMarkerProps),
                    coordinates: clusterer.lnglat,
                    onClick: async (event, mapEvent) => {
                        props.clusterMarkerProps.onClick?.(event, mapEvent);

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
                }, _element));
            }
            catch (e) {
                console.error(e);
            }
        }

        watch(element, updateElement);

        const firstUpdate = ref(false);

        onUpdated(() => {
            if (!firstUpdate.value) {
                firstUpdate.value = true;

                return;
            }
            emit('updatedCluster', props.feature.clusterer.clusterId);
        });

        return () => {
            return hF([
                h('div', {
                    ...containerProps.value.root,
                    ref: element,
                }, [
                    h('div', containerProps.value.children, slots.default?.({
                        clusterer: props.feature.clusterer,
                        coordinates: props.feature.clusterer.lnglat,
                        length: props.feature.clusterer.features.length,
                    })),
                ]),
            ]);
        };
    },
});
</script>
