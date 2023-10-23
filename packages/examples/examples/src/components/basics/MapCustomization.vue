<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        :settings="{
          location: {
            center,
            zoom: 15,
          },
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer :settings="{ theme, customization: customization2 ? CUSTOMIZATION_2 : CUSTOMIZATION }" />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'top left' }">
          <yandex-map-control-button :settings="{ onClick: customization2 = !customization2 }">
            Toggle customization
          </yandex-map-control-button>
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
  YandexMap, YandexMapControls, YandexMapDefaultSchemeLayer, YandexMapZoomControl, YandexMapControlButton,
} from 'vue-yandex-maps';
import { ref } from 'vue';

const customization2 = ref(false);

const CUSTOMIZATION = [
  // Making all building geometries transparent
  {
    tags: {
      all: ['structure'],
    },
    elements: 'geometry',
    stylers: [
      {
        opacity: 0,
      },
    ],
  },
  // Change the color of labels for all POIs and nodes of the public transport network
  {
    tags: {
      any: ['poi', 'transit_location'],
    },
    elements: 'label.text.fill',
    stylers: [
      {
        color: '#0000DD',
      },
    ],
  },
];

const CUSTOMIZATION_2 = [
  ...CUSTOMIZATION,
  {
    types: 'polygon',
    tags: {
      any: ['water'],
    },
    stylers: [
      {
        color: '#2A8ED5',
        opacity: 0.85,
      },
    ],
  },
];

// #endregion setup
</script>
