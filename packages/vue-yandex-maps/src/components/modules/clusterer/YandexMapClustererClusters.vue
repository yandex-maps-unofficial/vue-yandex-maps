<template>
    <div class="__ymap_clusterer_clusters">
        <yandex-map-clusterer-cluster
            v-for="feature in features"
            :key="feature.clusterer.clusterId"
            :cluster-marker-props
            :feature="feature"
            :zoom-on-cluster-click
            @trueBounds="emit('trueBounds', $event)"
            @updatedBounds="emit('updatedBounds', $event)"
            @updatedCluster="emit('updatedCluster', $event)"
        >
            <template #default="options">
                <slot
                    name="default"
                    v-bind="options"
                />
            </template>
        </yandex-map-clusterer-cluster>
    </div>
</template>

<script lang="ts" setup>
import type { ComputedRef, PropType } from 'vue';
import { inject } from 'vue';
import type { IYMapClusterFeature, YandexMapClustererZoomOptionsObject } from './YandexMapClusterer.vue';
import type { LngLatBounds, YMapMarker } from '@yandex/ymaps3-types';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';
import type { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import YandexMapClustererCluster from './YandexMapClustererCluster.vue';

defineOptions({ name: 'YandexMapClustererClusters' });

defineProps({
    clusterMarkerProps: {
        type: Object as PropType<Omit<ConstructorParameters<typeof YMapMarker>[0], 'coordinates'> & YandexMapMarkerCustomProps>,
        default: () => ({}),
    },
    zoomOnClusterClick: {
        type: [Boolean, Object] as PropType<boolean | YandexMapClustererZoomOptionsObject>,
        default: false,
    },
});

const emit = defineEmits<{
    (e: 'trueBounds', value: LngLatBounds): void;
    (e: 'updatedBounds', value: LngLatBounds): void;
    (e: 'updatedCluster', clusterId: string): void;
}>();

defineSlots<{
    default: (options: {
        clusterer: ClustererObject;
        coordinates: ClustererObject['lnglat'];
        length: number;
    }) => any;
}>();

const features = inject<ComputedRef<IYMapClusterFeature[]>>('clusterFeatures');
</script>
