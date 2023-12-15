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

        <yandex-map-feature :settings="POLYLINE1" />
        <yandex-map-feature :settings="POLYLINE2" />
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

const POLYLINE1: YMapFeatureProps = {
  id: 'one',
  draggable: true,
  geometry: {
    type: 'LineString',
    coordinates: [
      // Specify the coordinates of the vertices of the polyline.
      [37.5, 55.7],
      [37.4, 55.8],
      [37.5, 55.8],
      [37.4, 55.7],
    ],
  },
  style: { stroke: [{ color: '#f00', width: 4 }] },
};

const POLYLINE2: YMapFeatureProps = {
  id: 'second',
  geometry: {
    type: 'LineString',
    coordinates: [
      // Specify the coordinates of the vertices of the polyline.
      [37.4, 55.8],
      [37.5, 55.9],
      [37.5, 55.8],
      [37.4, 55.9],
    ],
  },
  style: { stroke: [{ color: '#ffff00', width: 5 }] },
};
// #endregion setup
</script>
