<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        :settings="{
          location: {
            center,
            zoom: 11,
          },
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
        <yandex-map-feature :settings="FEATURE1" />
        <yandex-map-feature :settings="FEATURE2" />
      </yandex-map>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap, YandexMapControls, YandexMapDefaultSchemeLayer, YandexMapZoomControl, YandexMapFeature, YandexMapDefaultFeaturesLayer,
} from 'vue-yandex-maps';
import type { YMapFeatureProps } from '@yandex/ymaps3-types';

const FEATURE1: YMapFeatureProps = {
  id: 'one',
  draggable: true,
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        // Specify the coordinates of the vertices of the rectangle.
        [37.6, 55.66],
        [37.66, 55.66],
        [37.66, 55.71],
        [37.6, 55.71],
      ],
    ],
  },
  style: {
    fill: 'rgba(56, 56, 219, 0.5)',
    stroke: [{ color: '#f00', width: 4 }],
  },
};

const FEATURE2: YMapFeatureProps = {
  id: 'second',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [37.63, 55.665],
        [37.73, 55.665],
        [37.73, 55.76],
        [37.63, 55.76],
      ],
    ],
  },
  style: {
    fill: 'rgba(44,52,42,0.5)',
    stroke: [{ color: '#00ff5a', width: 1 }],
  },
};
// #endregion setup
</script>
