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
          ...mapParameters,
          theme,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-cartesian-projection
          :bounds="[
            [-PIC_WIDTH / 2, PIC_HEIGHT / 2 - worldSize],
            [worldSize - PIC_WIDTH / 2, PIC_HEIGHT / 2],
          ]"
        />

        <yandex-map-tile-data-source :settings="dataSourceProps" />
        <yandex-map-layer :settings="layerProps" />
        <yandex-map-default-features-layer />
        <yandex-map-default-marker :settings="{ coordinates: [0, 0] }" />
      </yandex-map>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap, YandexMapCartesianProjection, YandexMapTileDataSource, YandexMapLayer, YandexMapDefaultFeaturesLayer, YandexMapDefaultMarker,
} from 'vue-yandex-maps';
import type {
  LngLatBounds, YMapLayerProps, YMapProps, YMapTileDataSourceProps,
} from '@yandex/ymaps3-types';

const TILES_PATH = 'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/custom-map/tiles';

/* To calculate the coordinates of the lower left and upper right corners of a rectangular coordinate
 * area, we need to know the maximum zoom, width and height of the image in pixels at maximum zoom.
 */
const MAX_ZOOM = 4;
const PIC_WIDTH = 2526;
const PIC_HEIGHT = 1642;

const dataSourceProps: YMapTileDataSourceProps = {
  id: 'custom',
  raster: {
    type: 'ground',

    /*
        fetchTile is called to get data for displaying a custom tile
        This method can be of several variants:
        1) x y z placeholders for tile coordinates
        2) method that returns final url
        3) method that fetches tile manually

        In this example, we use option 1
        */
    fetchTile: `${TILES_PATH}/{{z}}/tile-{{x}}-{{y}}.jpg`,
  },
  zoomRange: { min: 3, max: 4 },
  clampMapZoom: true,
};
/*
    A text identifier is used to link the data source and the layer.
    Be careful, the identifier for the data source is set in the id field,
    and the source field is used when transferring to the layer
*/
const layerProps: YMapLayerProps = {
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
const RESTRICT_AREA: LngLatBounds = [
  [-PIC_WIDTH / 2, -PIC_HEIGHT / 2],
  [PIC_WIDTH / 2, PIC_HEIGHT / 2],
];

const mapParameters: YMapProps = {
  location: { center: [0, 0], zoom: 3 },
  mode: 'raster',
  restrictMapArea: RESTRICT_AREA,
  // Do not copy the world along the axes
  // @ts-expect-error Яндекс забыли про cycledY в типах
  worldOptions: { cycledX: false, cycledY: false },
};
// #endregion setup
</script>
