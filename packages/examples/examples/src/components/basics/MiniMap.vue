<template>
    <common-wrapper>
        <template
            #default="{
                coordinates: center, theme, zoom, width, height,
            }"
        >
            <!-- #region html -->
            <yandex-map
                :height="height"
                :settings="{
                    location: {
                        center,
                        zoom,
                    },
                    theme,
                    showScaleInCopyrights: true,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-controls :settings="{ position: 'bottom right' }">
                    <yandex-map-mini-map
                        v-model="minimap"
                        :settings="{
                            size: [260, 170],
                            showCollapsedControl: false,
                            zoomOffset: 3,
                            showBounds: true,
                            boundsDrawingStyle: MINIMAP_BOUNDS_STYLE,
                        }"
                    />
                </yandex-map-controls>
            </yandex-map>
            <!-- #endregion html -->
        </template>
    </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import { YandexMap, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMapControls, YandexMapMiniMap } from 'vue-yandex-maps';
import type { YMapMiniMap } from '@yandex/ymaps3-minimap';
import { shallowRef } from 'vue';
import type { DrawingStyle } from '@yandex/ymaps3-types';

const minimap = shallowRef<null | YMapMiniMap>(null);
const MINIMAP_BOUNDS_STYLE: DrawingStyle = {
    fill: 'rgb(25, 109, 255)',
    fillOpacity: 0.08,
    stroke: [{ width: 1, color: '#313133' }],
};

// #endregion setup
</script>
