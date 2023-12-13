<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
      <!-- #region html -->
      <!-- Параметр real-settings-location в примере вызывает изменение геопозиции на каждое изменение settings. -->
      <!-- Ознакомьтесь с документацией компонента YandexMap, чтобы узнать больше, зачем он нужен и какие подводные камни -->
      <yandex-map
        :key="String(satellite)"
        v-model="map"
        :settings="{
          location: localLocation || {
            center,
            zoom,
          },
        }"
        real-settings-location
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer v-if="!useMercator && !satellite" :settings="{ theme }" />
        <template v-else-if="useMercator">
          <yandex-map-tile-data-source :settings="dataSourceProps" />
          <yandex-map-layer :settings="layerProps" />
        </template>

        <yandex-map-default-satellite-layer v-if="satellite" />

        <yandex-map-spherical-mercator-projection v-if="useMercator" />

        <yandex-map-controls :settings="{ position: 'top left' }">
          <yandex-map-control-button :settings="{ onClick: changeCenter }">
            Change center
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: setBounds }">
            Change borders
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: () => [useMercator = true, localLocation = NEW_LOCATION] }">
            Use OpenStreetMaps
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: () => satellite = !satellite }">
            Toggle Satellite layer
          </yandex-map-control-button>
        </yandex-map-controls>

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
  YandexMap,
  YandexMapControlButton,
  YandexMapControls,
  YandexMapDefaultMarker,
  YandexMapDefaultSatelliteLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapLayer,
  YandexMapSphericalMercatorProjection,
  YandexMapTileDataSource,
} from 'vue-yandex-maps';
import { ref, shallowRef } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import type { YMapLocationRequest } from '@yandex/ymaps3-types/imperative/YMap';

const map = shallowRef<YMap | null>(null);

const localLocation = shallowRef<YMapLocationRequest | null>(null);

const useMercator = ref(false);
const satellite = ref(false);

const changeCenter = () => {
  localLocation.value = {
    center: [40.925358, 57.767265],
    zoom: 9,
    duration: 1000,
  };
};

const setBounds = () => {
  localLocation.value = {
    bounds: [
      [37.60665514623445, 55.75504837113109],
      [37.64253237401767, 55.74430147115553],
    ],
    zoom: 9,
    duration: 1000,
  };
};

const dataSourceProps = {
  id: 'osm-satellite',
  copyrights: ['© OpenStreetMap contributors, CC-BY-SA'],
  raster: {
    type: 'ground',
    fetchTile: 'https://tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png',
  },
  zoomRange: {
    min: 0,
    max: 19,
  },
  clampMapZoom: true,
};

const layerProps = {
  id: 'satellite',
  source: 'osm-satellite',
  type: 'ground',
  options: {
    raster: {
      awaitAllTilesOnFirstDisplay: true,
    },
  },
};

const NEW_LOCATION = {
  center: [-73.98055350000001, 40.70696053904341],
  zoom: 10,
  duration: 1000,
};
// #endregion setup
</script>
