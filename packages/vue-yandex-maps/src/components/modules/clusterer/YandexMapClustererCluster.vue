<template>
    <teleport
        v-if="markerHost"
        :to="markerHost.element"
    >
        <div v-bind="containerProps.children">
            <slot
                :clusterer="feature.clusterer"
                :coordinates="feature.clusterer.lnglat"
                :length="feature.clusterer.features.length"
            />
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, onUpdated, watch, watchEffect } from 'vue';
import type { PropType } from 'vue';
import type { IYMapClusterFeature, YandexMapClustererZoomOptionsObject } from './YandexMapClusterer.vue';
import { createMarkerContainer, excludeYandexMarkerProps, getMarkerContainerProps, getBoundsFromCoords, getLocationFromBounds, injectMap, sleep } from '#core';
import type { LngLatBounds, YMapMarker, YMapMarkerProps } from '@yandex/ymaps3-types';
import type { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';

defineOptions({ name: 'YandexMapClustererCluster' });

const props = defineProps({
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

const map = injectMap();
const markerHost = createMarkerContainer();
let marker: YMapMarker | undefined;
let markerParent: IYMapClusterFeature['element'] | undefined;

const containerProps = computed(() => getMarkerContainerProps({
    position: props.clusterMarkerProps.position ?? 'top-center left-center',
    containerAttrs: props.clusterMarkerProps.containerAttrs,
    wrapperAttrs: props.clusterMarkerProps.wrapperAttrs,
    zeroSizes: props.clusterMarkerProps.zeroSizes,
}));

watchEffect(() => markerHost?.update(containerProps.value.root));
onUnmounted(() => markerHost?.destroy());

async function onClick(event: Parameters<NonNullable<YMapMarkerProps['onClick']>>[0], mapEvent: Parameters<NonNullable<YMapMarkerProps['onClick']>>[1]) {
    props.clusterMarkerProps.onClick?.(event, mapEvent);

    if (props.feature.clusterer.features.length >= 2) {
        const settings: YandexMapClustererZoomOptionsObject = typeof props.zoomOnClusterClick === 'object' ? props.zoomOnClusterClick : {};

        const featuresCoords = props.feature.clusterer.features.map(x => x.geometry.coordinates);
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
}

const markerSettings = computed<YMapMarkerProps>(() => ({
    ...excludeYandexMarkerProps(props.clusterMarkerProps),
    coordinates: props.feature.clusterer.lnglat,
    onClick,
}));

function updateMarker() {
    if (!marker) marker = new ymaps3.YMapMarker(markerSettings.value, markerHost!.element);
    else marker.update(markerSettings.value);

    if (markerParent !== props.feature.element) {
        if (markerParent && marker.parent === markerParent) markerParent.removeChild(marker);
        markerParent = props.feature.element;
        markerParent.addChild(marker);
    }
}

onMounted(updateMarker);
// Traverse marker settings only. A collection links back to the entire SDK tree.
watch(() => props.feature.element, updateMarker);
watch(markerSettings, updateMarker, { deep: true });
onBeforeUnmount(() => {
    if (marker && markerParent && marker.parent === markerParent) markerParent.removeChild(marker);
});

let firstUpdate = false;
onUpdated(() => {
    if (!firstUpdate) {
        firstUpdate = true;
        return;
    }
    emit('updatedCluster', props.feature.clusterer.clusterId);
});
</script>
