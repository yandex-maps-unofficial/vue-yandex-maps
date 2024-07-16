<script lang="ts">
import type { ComputedRef, PropType, SlotsType, VNode } from 'vue';
import { defineComponent, h, inject } from 'vue';
import type { IYMapClusterFeature, YandexMapClustererZoomOptionsObject } from './YandexMapClusterer.vue';
import type { LngLatBounds, YMapMarker } from '@yandex/ymaps3-types';
import { hF, isVue2 } from '../../../utils/system.ts';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';
import type { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import YandexMapClustererCluster from './YandexMapClustererCluster.vue';

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
    setup(props, { emit, slots }) {
        const features = inject<ComputedRef<IYMapClusterFeature[]>>('clusterFeatures');

        return () => {
            let clusterSlots: VNode[];

            if (isVue2()) {
                clusterSlots = features!.value
                    // @ts-expect-error Vue2
                    .map(feature => h(YandexMapClustererCluster, {
                        props: {
                            clusterMarkerProps: props.clusterMarkerProps,
                            zoomOnClusterClick: props.zoomOnClusterClick,
                            feature,
                        },
                        on: {
                            trueBounds: (e: LngLatBounds) => emit('trueBounds', e),
                            updatedBounds: (e: LngLatBounds) => emit('updatedBounds', e),
                            updatedCluster: (e: string) => emit('updatedCluster', e),
                        },
                        scopedSlots: {
                            default: (options: any) => h('div', {}, [slots.default?.(options)]),
                        },
                        key: feature.clusterer.clusterId,
                    }));
            }
            else {
                clusterSlots = features!.value
                    .map(feature => h(YandexMapClustererCluster, {
                        clusterMarkerProps: props.clusterMarkerProps,
                        zoomOnClusterClick: props.zoomOnClusterClick,
                        feature,
                        onTrueBounds: (e: LngLatBounds) => emit('trueBounds', e),
                        onUpdatedBounds: (e: LngLatBounds) => emit('updatedBounds', e),
                        onUpdatedCluster: (e: string) => emit('updatedCluster', e),
                        key: feature.clusterer.clusterId,
                    }, {
                        default: (options: any) => slots.default?.(options),
                    }));
            }

            return hF(clusterSlots);
        };
    },
});
</script>
