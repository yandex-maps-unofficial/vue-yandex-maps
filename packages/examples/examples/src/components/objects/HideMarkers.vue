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
          theme,
          showScaleInCopyrights: true,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'top left' }">
          <yandex-map-control-button>
            <label>
              hideOutsideViewport: true

              <input v-model="mode" type="radio" name="mode" :value="true" />
            </label>
            <br>
            <label>
              hideOutsideViewport: {extent: size}
              <input v-model="mode" type="radio" name="mode" :value="false" />
            </label>
          </yandex-map-control-button>
        </yandex-map-controls>
        <yandex-map-marker
          v-for="(p, i) in points"
          :key="i"
          :settings="{ coordinates: p.coordinates, hideOutsideViewport: mode === true ? true : false }"
        >
          <div class="marker" :style="p.style" />
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
  YandexMapControlButton,
} from 'vue-yandex-maps';
import { ref } from 'vue';
import type { LngLat } from '@yandex/ymaps3-types';

const mode = ref(true);
const BOUNDS = [
  [35.25003512499998, 56.24506103566212],
  [39.99612887499998, 55.253693595469706],
];
const MAX_POINT_SIZE = 220;

const [lb, rt] = BOUNDS;
const DELTA = 6;

const EXT_BOUNDS = [
  [lb[0] - DELTA, lb[1] + DELTA],
  [rt[0] + DELTA, rt[1] - DELTA],
];

const ZOOM_RANGE = { min: 9, max: 10 };

const seed = (s: number) => () => {
  s = Math.sin(s) * 10000;
  return s - Math.floor(s);
};

const rnd = seed(10000); // () => Math.random()

const point = (bounds: number[][]) => [
  bounds[0][0] + (bounds[1][0] - bounds[0][0]) * rnd(),
  bounds[1][1] + (bounds[0][1] - bounds[1][1]) * rnd(),
];

const getRandomPoints = (count: number) => Array.from({ length: count }, (_, i) => {
  const size = 10 + rnd() * MAX_POINT_SIZE;

  return {
    coordinates: point(EXT_BOUNDS) as LngLat,
    style: {
      '--point-size': `${size}px`,
      '--point-bg-color': `hsl(${i % 365}deg 50% 50%)`,
    },
    size,
  };
});

const points = getRandomPoints(2000);

// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.marker {
  width: var(--point-size, 10px);
  aspect-ratio: 1/1;
  border: 1px solid #0e86e6;
  background-color: var(--point-bg-color, #858585);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
</style>
<!-- #endregion style -->
