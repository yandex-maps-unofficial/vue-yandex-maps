<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        v-model="map"
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
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>

        <yandex-map-marker :settings="{ coordinates: center }">
          <img
            alt=""
            src="/vue-yandex-maps/pin.svg"
            :style="{
              minWidth: '50px',
              position: 'relative',
              boxSizing: 'border-box',
              transform: 'translate(-50%, calc(-50% - 24px))',
              cursor: 'pointer',
            }"
            @click="map?.setLocation({ center, zoom, duration: 400 })"
          />
        </yandex-map-marker>
      </yandex-map>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker,
  YandexMapZoomControl,
} from 'vue-yandex-maps';
import { shallowRef } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';

const map = shallowRef<YMap | null>(null);
// #endregion setup
</script>
