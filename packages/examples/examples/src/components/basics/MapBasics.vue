<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
      <yandex-map
        :settings="{
          location: {
            center,
            zoom,
          },
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer :settings="{ theme }" />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
      </yandex-map>
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import {
  YandexMap, YandexMapDefaultSchemeLayer, YandexMapControls, YandexMapZoomControl,
} from 'vue-yandex-maps';
import CommonWrapper from '../CommonWrapper.vue';
</script>
