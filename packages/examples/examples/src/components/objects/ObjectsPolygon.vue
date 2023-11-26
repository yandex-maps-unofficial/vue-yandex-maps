<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        v-model="map"
        :settings="{
          location: {
            center,
            zoom: 10,
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
  YandexMap,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapFeature,
  YandexMapZoomControl,
} from 'vue-yandex-maps';
import { shallowRef } from 'vue';
import type { YMap, YMapFeatureProps } from '@yandex/ymaps3-types';

const map = shallowRef<YMap | null>(null);

const FEATURE1: YMapFeatureProps = {
  id: 'one',
  draggable: true,
  geometry: {
    type: 'Polygon',
    coordinates: [
      // The coordinates of the vertices of the outer contour.
      [
        [37.8, 55.75],
        [37.9, 55.8],
        [38.0, 55.75],
        [38.0, 55.7],
        [37.8, 55.7],
      ],
      // The coordinates of the vertices of the inner contour.
      [
        [37.82, 55.75],
        [37.98, 55.75],
        [37.9, 55.65],
      ],
    ],
  },
  style: {
    fillRule: 'nonzero',
    fill: '#00FF00',
    fillOpacity: 0.9,
    stroke: [
      {
        color: '#0000FF',
        // Stroke width.
        width: 5,
        // Stroke style.
        dash: [4, 8],
      },
    ],
  },
};

const FEATURE2: YMapFeatureProps = {
  id: 'second',
  geometry: {
    type: 'Polygon',
    coordinates: [
      // Specify the coordinates of the vertices of the polygon.
      // The coordinates of the vertices of the outer contour.
      [
        [37.5, 55.75],
        [37.6, 55.8],
        [37.7, 55.75],
        [37.7, 55.7],
        [37.5, 55.7],
      ],
      // The coordinates of the vertices of the inner contour.
      [
        [37.52, 55.75],
        [37.68, 55.75],
        [37.6, 55.65],
      ],
    ],
  },
  style: {
    fill: '#00FF0088',
    stroke: [{ color: '#f66e30', width: 5 }],
  },
};
// #endregion setup
</script>
