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
          theme,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>

        <yandex-map-marker :settings="{ coordinates: center }">
          <img
            class="pin"
            alt=""
            :src="'/vue-yandex-maps/pin.svg'"
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

<!-- #region style -->
<style scoped>
.pin {
  min-width: 50px;
  position: relative;
  box-sizing: border-box;
  transform: translate(-50%, calc(-50% - 24px));
  cursor: pointer;
}
</style>
<!-- #endregion style -->
