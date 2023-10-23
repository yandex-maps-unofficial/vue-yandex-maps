<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        :settings="{
          location: {
            center,
            zoom,
          },
          zoomRange: ZOOM_RANGE,
          restrictMapArea: RESTRICT_AREA,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer :settings="{ theme }" />
        <yandex-map-default-features-layer />
        <yandex-map-default-marker :settings="{ coordinates: RESTRICT_AREA[0], color: 'green' }" />
        <yandex-map-default-marker :settings="{ coordinates: RESTRICT_AREA[1], color: 'red' }" />
      </yandex-map>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap, YandexMapControls, YandexMapDefaultSchemeLayer, YandexMapZoomControl, YandexMapDefaultFeaturesLayer, YandexMapDefaultMarker,
} from 'vue-yandex-maps';

const RESTRICT_AREA = [
  [29.511, 59.838],
  [30.829, 60.056],
];
const ZOOM_RANGE = { min: 11, max: 13 };
// #endregion setup
</script>
