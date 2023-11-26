<template>
  <common-wrapper>
    <template
      #default="{
        width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        :settings="{
          location: {
            center: [0, 0],
            zoom: 2,
          },
          mode: 'raster',
          restrictMapArea: RESTRICT_AREA,
          worldOptions: { cycledX: false, cycledY: false },
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-tile-data-source :settings="dataSourceProps" />
        <yandex-map-layer :settings="layerProps" />
        <yandex-map-default-features-layer />
        <yandex-map-cartesian-projection :bounds="[[-PIC_WIDTH / 2, PIC_HEIGHT / 2 - worldSize], [worldSize - PIC_WIDTH / 2, PIC_HEIGHT / 2]]" />
        <yandex-map-default-marker :settings="{ coordinates: [0, 0] }" />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
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
  YandexMapDefaultMarker,
  YandexMapLayer,
  YandexMapTileDataSource,
  YandexMapZoomControl,
  YandexMapCartesianProjection,
} from 'vue-yandex-maps';

const TILES_PATH = 'https://s3.mds.yandex.net/front-maps-static/maps-front-jsapi-3/examples/images/custom-map/tiles';

/* To calculate the coordinates of the lower left and upper right corners of a rectangular coordinate
 * area, we need to know the maximum zoom, width and height of the image in pixels at maximum zoom.
 */
const MAX_ZOOM = 4;
const PIC_WIDTH = 2526;
const PIC_HEIGHT = 1642;

const dataSourceProps = {
  id: 'custom',
  raster: {
    type: 'ground',
    fetchTile: `${TILES_PATH}/{{z}}/tile-{{x}}-{{y}}.jpg`,
  },
  zoomRange: {
    min: 2,
    max: 4,
  },
  clampMapZoom: true,
};

const layerProps = {
  id: 'customLayer',
  source: 'custom',
  type: 'ground',
  options: {
    raster: {
      awaitAllTilesOnFirstDisplay: true,
    },
  },
};

// Calculate the size of all tiles at the maximum zoom.
const worldSize = 2 ** MAX_ZOOM * 256;

// Limiting the scrolling area of our map to the size of the entire image
const RESTRICT_AREA = [
  [-PIC_WIDTH / 2, -PIC_HEIGHT / 2],
  [PIC_WIDTH / 2, PIC_HEIGHT / 2],
];

// #endregion setup
</script>
