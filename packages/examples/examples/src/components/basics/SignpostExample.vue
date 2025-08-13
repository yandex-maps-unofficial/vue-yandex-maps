<template>
    <common-wrapper>
        <template
            #default="{
                coordinates: center, theme, width, height,
            }"
        >
            <!-- #region html -->
            <yandex-map
                :height="height"
                :settings="{
                    location: {
                        center,
                        zoom: 12,
                    },
                    theme,
                    showScaleInCopyrights: true,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-signpost :settings="{ points: MARKERS_COORDINATES }"/>
                <yandex-map-default-marker
                    v-for="(point, index) in MARKERS_COORDINATES"
                    :key="index"
                    :settings="{ coordinates: point }"
                />
            </yandex-map>
            <!-- #endregion html -->
        </template>
    </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import { YandexMap, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMapSignpost, YandexMapDefaultMarker } from 'vue-yandex-maps';
import type { LngLat } from '@yandex/ymaps3-types';

const MARKERS_COORDINATES: Array<LngLat> = [
    [37.583423, 55.837911],
    [37.54927, 55.778255],
    [37.414095, 55.784683],
    [37.684269, 55.76924],
    [37.477107, 55.771746],
    [37.452467, 55.724702],
    [37.497155, 55.644694],
    [37.847937, 55.867562],
    [37.8476, 55.753265],
    [37.502478, 55.700959],
    [37.402294, 55.766331],
    [37.409258, 55.876093],
    [37.693193, 55.747229],
    [37.523812, 55.806159],
    [37.464661, 55.861453],
    [37.463628, 55.776678],
    [37.430691, 55.770738],
    [37.451287, 55.659223],
    [37.692163, 55.849577],
    [37.832775, 55.690248],
    [37.549375, 55.8179],
    [37.783724, 55.833045],
    [37.396895, 55.625419],
    [37.665582, 55.691988],
    [37.848205, 55.697897],
];
// #endregion setup
</script>

