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
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>

        <template v-if="dataSource">
          <yandex-map-tile-data-source :settings="{ id: layerId, raster: dataSource }" />
          <yandex-map-layer :settings="{ id: layerId, source: layerId, type: layerId }" />
        </template>
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
  YandexMapDefaultSchemeLayer,
  YandexMapLayer,
  YandexMapTileDataSource,
  YandexMapZoomControl,
} from 'vue-yandex-maps';
import { onMounted } from 'vue';
import type { FetchedTile, YMapTileDataSourceProps } from '@yandex/ymaps3-types';

const TILE_SIZE = 256;

const layerId = 'A';

let dataSource: YMapTileDataSourceProps['raster'] | undefined;

onMounted(() => {
  const image = new Image();

  const load = new Promise<void>((resolve, reject) => {
    image.src = '/vue-yandex-maps/ship.svg';
    if (image.complete) {
      resolve();
    } else {
      image.onload = () => resolve();
      image.onerror = () => reject();
    }
  });

  dataSource = {
    type: layerId,
    fetchTile: async (x: number, y: number, z: number): Promise<FetchedTile> => {
      // When the image is loaded fetchTile will return a canvas tile promise
      await load;
      const canvas = document.createElement('canvas');

      canvas.width = TILE_SIZE;
      canvas.height = TILE_SIZE;

      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('ctx is undefined');

      ctx.strokeStyle = '#007afce6';
      ctx.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);

      ctx.font = '20px Arial';
      ctx.fillStyle = '#999';
      ctx.fillText(JSON.stringify({ x, y, z }), 10, 30);

      ctx.drawImage(image, TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 2);

      return { image: canvas };
    },
  };
});
// #endregion setup
</script>
