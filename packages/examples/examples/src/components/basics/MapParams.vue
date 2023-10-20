<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
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
        <yandex-map-default-scheme-layer v-if="!useMercator" :settings="{ theme }" />
        <template v-else>
          <yandex-map-tile-data-source :settings="dataSourceProps" />
          <yandex-map-layer :settings="layerProps" />
        </template>

        <yandex-map-spherical-mercator-projection v-if="useMercator" />

        <yandex-map-controls :settings="{ position: 'top left' }">
          <yandex-map-control-button @click="changeCenter">
            Change center
          </yandex-map-control-button>
          <yandex-map-control-button @click="setBounds">
            Change borders
          </yandex-map-control-button>
          <yandex-map-control-button @click="[useMercator = true, map!.setLocation(NEW_LOCATION)]">
            Change type and reset
          </yandex-map-control-button>
        </yandex-map-controls>
      </yandex-map>
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import {
  YandexMap, YandexMapDefaultSchemeLayer, YandexMapControls, YandexMapControlButton, YandexMapSphericalMercatorProjection, YandexMapTileDataSource, YandexMapLayer,
} from 'vue-yandex-maps';
import { shallowRef, ref } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import CommonWrapper from '../CommonWrapper.vue';

const map = shallowRef<YMap | null>(null);

const useMercator = ref(false);

const changeCenter = () => {
  map.value!.setLocation({
    center: [40.925358, 57.767265],
  });
};

const setBounds = () => {
  map.value!.setLocation({
    bounds: [
      [37.60665514623445, 55.75504837113109],
      [37.64253237401767, 55.74430147115553],
    ],
  });
};

const dataSourceProps = {
  id: 'osm-satellite',
  copyrights: ['© OpenStreetMap contributors, CC-BY-SA'],
  raster: {
    type: 'ground',
    fetchTile: 'https://tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png',
  },
  zoomRange: { min: 0, max: 19 },
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
</script>
