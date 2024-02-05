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
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
        <yandex-map-default-marker
          v-model="defaultMarker"
          :settings="{
            //Здесь вам НУЖНО брать координаты либо из функции onDragMove, либо из маркера, стриггерив реактивность
            //Яндекс при выполнении функции .update зачем-то подставляет оригинальные координаты, хотя они не менялись =(
            coordinates: defaultMarker ? defaultMarker.coordinates : center,
            title: `Долгота: ${defaultMarker?.coordinates[0].toFixed(2)}<br>Широта: ${defaultMarker?.coordinates[1].toFixed(2)}`,
            draggable: true,
            onDragMove,
          }"
        />
      </yandex-map>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMapDefaultMarker,
} from 'vue-yandex-maps';
import { shallowRef, triggerRef } from 'vue';
import type { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';

const defaultMarker = shallowRef<YMapDefaultMarker | null>(null);

const onDragMove = () => {
  triggerRef(defaultMarker);
};
// #endregion setup
</script>
