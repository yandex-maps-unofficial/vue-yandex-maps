<template>
    <common-wrapper>
        <template
            #default="{
                coordinates, theme, width, height,
            }"
        >
            <!-- #region html -->
            <yandex-map
                v-model="map"
                :height="height"
                :settings="{
                    location,
                    theme,
                    showScaleInCopyrights: true,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-default-marker :settings="{ coordinates, properties: { coordinates } }"/>
                <yandex-map-context-menu
                    :settings="{ visible, screenCoordinates }"
                >
                    <yandex-map-context-menu-item :settings="{ text: 'Zoom in', icon: '/vue-yandex-maps/zoomInIcon.svg', visible: true, onClick: zoomIn }"/>
                    <yandex-map-context-menu-item :settings="{ text: 'Zoom out', icon: '/vue-yandex-maps/zoomOutIcon.svg', visible: true, onClick: zoomOut }"/>
                    <yandex-map-context-menu-item :settings="{ text: 'Center by it', icon: '/vue-yandex-maps/centerByItIcon.svg', visible: true, onClick: centerByIt }"/>
                    <yandex-map-context-menu-item
                        v-if="visibleMarkerCoords"
                        :settings="{ text: 'Focus on marker', visible: true, onClick: clickOnMarker }"
                    />
                </yandex-map-context-menu>
                <yandex-map-listener :settings="{ onContextMenu, onActionStart }"/>
            </yandex-map>
            <!-- #endregion html -->
        </template>
    </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import { ref, shallowRef } from 'vue';
import { YandexMap, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMapContextMenu, YandexMapListener, YandexMapContextMenuItem, YandexMapDefaultMarker } from 'vue-yandex-maps';
import type { BehaviorMapEventHandler, DomEventHandler, LngLat, YMap } from '@yandex/ymaps3-types';
import type { YMapLocationRequest } from '@yandex/ymaps3-types/imperative/YMap';

const visible = ref(false);
const screenCoordinates = ref<[number, number]>([0, 0]);
const contextMenuCoordinates = ref<[number, number]>([0, 0]);
const visibleMarkerCoords = ref<LngLat | null>(null);
const map = shallowRef<YMap | null>(null);

const onContextMenu: DomEventHandler = async (object, event) => {
    if (object && object.entity instanceof ymaps3.YMapMarker) {
        visibleMarkerCoords.value = object.entity.properties!.coordinates as LngLat;
    }
    else visibleMarkerCoords.value = null;

    screenCoordinates.value = event.screenCoordinates;
    contextMenuCoordinates.value = event.coordinates as [number, number];
    visible.value = true;
};

const location = ref<YMapLocationRequest>({
    center: [37.623082, 55.75254],
    zoom: 9,
});

const onActionStart: BehaviorMapEventHandler = () => {
    visible.value = false;
};

const zoomIn = () => {
    location.value = {
        zoom: map.value!.zoom + 1,
        duration: 400,
        easing: 'ease-in-out',
    };
    visible.value = false;
};

const zoomOut = () => {
    location.value = {
        zoom: map.value!.zoom - 1,
        duration: 600,
        easing: 'ease-in-out',
    };
    visible.value = false;
};

const centerByIt = () => {
    location.value = { center: contextMenuCoordinates.value, duration: 500, easing: 'ease-in-out' };
    visible.value = false;
};

const clickOnMarker = () => {
    location.value = {
        center: visibleMarkerCoords.value!,
        zoom: 15,
        duration: 600,
        easing: 'ease-in-out',
    };
    visible.value = false;
};
// #endregion setup
</script>
