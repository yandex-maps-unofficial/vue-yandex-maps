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
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer :settings="{ theme }" />
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>

        <yandex-map-default-marker
          :settings="{
            coordinates: center,
            title: 'Marker with slot',
            subtitle: 'Marker with slot description',
            color: 'green',
            popup: { position: 'top' },
          }"
        >
          <template #popup="{ close }">
            <div
              :style="{
                background: '#fff',
                borderRadius: '10px',
                padding: '10px',
                color: 'black',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap',
              }"
              @click="close()"
            >
              Click me to close popup
            </div>
          </template>
        </yandex-map-default-marker>

        <yandex-map-default-marker
          :settings="{
            coordinates: [37.188144, 55.933842],
            title: 'Marker with static content',
            subtitle: 'Marker with static content description',
            color: 'green',
            popup: { position: 'top', content: 'Static content that hides marker', hidesMarker: true },
          }"
        >
          <template #popup="{ close }">
            <div
              :style="{
                background: '#fff',
                borderRadius: '10px',
                padding: '10px',
                color: 'black',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap',
              }"
              @click="close()"
            >
              Click me to close popup
            </div>
          </template>
        </yandex-map-default-marker>

        <yandex-map-marker
          v-for="(marker, index) in markers"
          :key="index"
          :settings="{ coordinates: marker.coordinates, onClick: () => openMarker = index, zIndex: openMarker === index ? 1 : 0 }"
        >
          <div
            :style="{
              background: 'green',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              cursor: 'pointer',
              color: 'white',
              padding: '10px 20px',
              whiteSpace: 'nowrap',
            }"
          >
            Marker {{ index }}

            <div
              v-if="openMarker === index"
              :style="{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                background: '#fff',
                borderRadius: '10px',
                padding: '10px',
                color: 'black',
              }"
              @click.stop="openMarker = null"
            >
              Click me to close popup
            </div>
          </div>
        </yandex-map-marker>
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
  YandexMapDefaultFeaturesLayer,
  YandexMapMarker,
  YandexMapDefaultMarker,
  YandexMapZoomControl,
} from 'vue-yandex-maps';
import { ref } from 'vue';

const markers = [
  {
    coordinates: [37.188144, 55.733842],
  },
  {
    coordinates: [37.588144, 55.733842],
  },
  {
    coordinates: [37.988144, 55.733842],
  },
];

const openMarker = ref<null | number>(null);
// #endregion setup
</script>
