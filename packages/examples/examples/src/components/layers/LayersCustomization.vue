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
        <yandex-map-default-scheme-layer :settings="{ customization }" />

        <yandex-map-controls :settings="{ position: 'top right' }">
          <yandex-map-control>
            <layers-customization-control
              title="Вода"
              :change-color-handler="() => changeColor(['water'], 'geometry')"
            />
          </yandex-map-control>
        </yandex-map-controls>
        <!-- #endregion html -->
      </yandex-map>
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap, YandexMapControl, YandexMapControls, YandexMapDefaultSchemeLayer,
} from 'vue-yandex-maps';
import LayersCustomizationControl from './LayersCustomizationControl.vue';
import type {
  VectorCustomization,
  VectorCustomizationElements,
  VectorCustomizationItem,
  YMapLocationRequest,
} from '@yandex/ymaps3-types';
import { reactive, shallowRef, triggerRef } from 'vue';

const LOCATION: YMapLocationRequest = {
  center: [37.623082, 55.75254], // starting position [lng, lat]
  zoom: 11, // starting zoom
};

const customization = shallowRef<VectorCustomization>([
  {
    tags: {
      any: ['road'],
    },
    elements: 'geometry',
    stylers: [
      {
        color: '#4E4E4E',
      },
    ],
  },
  {
    tags: {
      any: ['water'],
    },
    elements: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    tags: {
      any: ['landscape', 'admin', 'land', 'transit'],
    },
    elements: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    tags: {
      any: ['building'],
    },
    elements: 'geometry',
    stylers: [
      {
        color: '#757474',
      },
    ],
  },
]);

// Function generates a random color in HEX format
const generateColor = () => `#${Math.floor(Math.random() * 16777215)
  .toString(16)}`;

const changeColor = (controlTags: string[], controlElements: VectorCustomizationElements) => {
  const customizationObject = customization.value.find(
    (item: any) => typeof item.tags === 'object' && JSON.stringify(item.tags.any) === JSON.stringify(controlTags),
  );

  if (customizationObject) {
    (customizationObject.stylers as any[])[0].color = generateColor();
  } else {
    const newTagObject: VectorCustomizationItem = {
      tags: { any: controlTags },
      elements: controlElements,
      stylers: [{ color: generateColor() }],
    };

    customization.value.push(newTagObject);
  }

  triggerRef(customization);
};
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.container {
  display: flex;
  height: 100%;
}
</style>
<!-- #endregion style -->
