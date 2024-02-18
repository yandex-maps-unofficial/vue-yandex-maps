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
          theme,
          showScaleInCopyrights: true,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-spherical-mercator-projection />
        <yandex-map-tile-data-source :settings="dataSourceProps" />
        <yandex-map-layer :settings="layerProps" />
      </yandex-map>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap, YandexMapSphericalMercatorProjection, YandexMapTileDataSource, YandexMapLayer,
} from 'vue-yandex-maps';
import type { YMapLayerProps, YMapTileDataSourceProps } from '@yandex/ymaps3-types';

const dataSourceProps: YMapTileDataSourceProps = {
  id: 'custom',
  copyrights: ['© OpenStreetMap contributors'],
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
    fetchTile: 'https://tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png',
  },
  zoomRange: { min: 0, max: 19 },
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
// #endregion setup
</script>
