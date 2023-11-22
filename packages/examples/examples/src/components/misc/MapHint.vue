<template>
  <common-wrapper>
    <template
      #default="{
        theme, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        :settings="{
          location: LOCATION,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer :settings="{ theme }" />
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>

        <yandex-map-collection>
          <yandex-map-marker v-for="(feature, index) in POINTS" :key="index" :settings="{ coordinates: feature.coordinates, color: feature.color, properties: { hint: feature.hint } }">
            <div :style="{ transform: 'translate(-15px -33px)', position: 'absolute' }" v-html="markerSvg(feature.color)" />
          </yandex-map-marker>
        </yandex-map-collection>
        <yandex-map-collection>
          <yandex-map-feature v-for="(feature, index) in LINES" :key="index" :settings="{ geometry: feature.geometry, style: feature.style, properties: { hint: feature.hint } }" />
        </yandex-map-collection>
        <yandex-map-collection>
          <yandex-map-feature v-for="(feature, index) in TRIANGLES" :key="index" :settings="{ geometry: feature.geometry, style: feature.style, properties: { hint: feature.hint } }" />
        </yandex-map-collection>

        <yandex-map-hint hint-property="hint">
          <template #default="{ content }">
            <div
              class="hint"
              :style="{
                position: 'absolute',
                padding: '4px',
                background: 'white',
                border: '1px solid black',
                whiteSpace: 'nowrap',
                opacity: '0.7',
                transform: 'translate(8px, -50%)',
              }"
            >
              {{ content }}
            </div>
          </template>
        </yandex-map-hint>
      </yandex-map>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap, YandexMapControls, YandexMapDefaultSchemeLayer, YandexMapZoomControl, YandexMapDefaultFeaturesLayer, YandexMapHint, YandexMapCollection, YandexMapFeature, YandexMapMarker,
} from 'vue-yandex-maps';

const BOUNDS = [
  [36.76340182421873, 56.50491493486398],
  [38.48276217578123, 54.98530386445313],
];
const LOCATION = { bounds: BOUNDS };

const seed = (s: number) => () => {
  s = Math.sin(s) * 10000;
  return s - Math.floor(s);
};

const rnd = seed(10000); // () => Math.random()
const color = () => `rgb(${rnd() * 256}, ${rnd() * 256}, ${rnd() * 256})`;
const point = () => [
  BOUNDS[0][0] + (BOUNDS[1][0] - BOUNDS[0][0]) * rnd(),
  BOUNDS[1][1] + (BOUNDS[0][1] - BOUNDS[1][1]) * rnd(),
];
const pointsNearby = (coords: number[], n: number) => Array.from({ length: n }, () => [coords[0] + (rnd() - 0.5) * 0.5, coords[1] + (rnd() - 0.5) * 0.5]);
const stroke = () => [{ color: color(), width: Math.floor(2 + rnd() * 6) }];

const POINTS = Array.from({ length: 40 }, (_, i) => ({
  color: color(),
  coordinates: point(),
  hint: `marker #${i}`,
}));
const LINES = Array.from({ length: 10 }, (_, i) => ({
  geometry: { type: 'LineString', coordinates: [point(), point()] },
  style: { stroke: stroke() },
  hint: `line #${i}`,
}));
const TRIANGLES = Array.from({ length: 10 }, (_, i) => ({
  geometry: { type: 'Polygon', coordinates: [pointsNearby(point(), 3)] },
  style: { stroke: stroke(), fill: color() },
  hint: `triangle #${i}`,
}));

const markerSvg = (fill: string) => `
<svg width="29" height="34" viewBox="0 0 58 67" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter)">
        <path d="M34.342 49.376c-3.076.93-4.687 2.979-4.831 6.147a.5.5 0 0 1-.5.477h-.022a.5.5 0 0 1-.5-.477c-.144-3.168-1.755-5.217-4.831-6.147C13.53 46.968 6 37.863 6 27 6 14.297 16.297 4 29 4s23 10.297 23 23c0 10.863-7.531 19.968-17.658 22.376z" fill="${fill}" />
    </g>
    <path d="M29 67a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="#fff" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M29 65a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="${fill}" />
    <defs>
        <filter id="filter" x="0" y="0" width="58" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="3" />
            <feColorMatrix values="0 0 0 0 0.4 0 0 0 0 0.396078 0 0 0 0 0.380392 0 0 0 0.2 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_9595_81428" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_9595_81428" result="shape" />
        </filter>
    </defs>
</svg>
`;
// #endregion setup
</script>
