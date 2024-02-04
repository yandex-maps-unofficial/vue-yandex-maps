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
          showScaleInCopyrights: true,
          theme,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />

        <yandex-map-marker v-for="marker in markers" :key="marker.iconSrc" :settings="{ coordinates: marker.coordinates }" position="top-center left-center">
          <img
            class="pin"
            alt=""
            :src="marker.iconSrc"
            @click="produceAnAlert"
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
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker,
} from 'vue-yandex-maps';
import type { LngLat } from '@yandex/ymaps3-types';
import { ref } from 'vue';

const counter = ref(0);

const produceAnAlert = () => {
  alert(`${++counter.value} capybara`);
};

const markers = [
  {
    coordinates: [37.623, 55.752] as LngLat,
    iconSrc:
        'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/marker-custom-icon/yellow-capybara.png',
  },
  {
    coordinates: [38.125, 55.622] as LngLat,
    iconSrc:
        'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/marker-custom-icon/purple-capybara.png',
  },
  {
    coordinates: [37.295, 55.415] as LngLat,
    iconSrc:
        'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/marker-custom-icon/green-capybara.png',
  },
];
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.pin {
  cursor: pointer;
  max-width: unset;
  width: 75px;
  height: 75px;
  border-radius: 50%;
}
</style>
<!-- #endregion style -->
