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
          theme,
          showScaleInCopyrights: true,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-satellite-layer />
        <yandex-map-default-features-layer />
        <yandex-map-default-marker :settings="{ coordinates: center }" />
      </yandex-map>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap, YandexMapDefaultMarker, YandexMapDefaultFeaturesLayer, YandexMapDefaultSatelliteLayer,
} from 'vue-yandex-maps';
// #endregion setup
</script>
