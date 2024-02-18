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

        <yandex-map-controls :settings="{ position: 'top right', orientation: 'vertical' }">
          <yandex-map-control>
            <div class="controls" :style="{ '--map-height': height }">
              <layers-customization-control
                title="Вода"
                :enabled-controls="['color', 'opacity', 'scale']"
                :change-handler="(type, diff) => changeColor(['water'], type, diff)"
              />
              <layers-customization-control
                title="Земля"
                :enabled-controls="['color', 'opacity']"
                :change-handler="(type, diff) => changeColor(['landscape', 'admin', 'land', 'transit'], type, diff)"
              />
              <layers-customization-control
                title="Дороги"
                :enabled-controls="['color', 'opacity', 'scale']"
                :change-handler="(type, diff) => changeColor(['road'], type, diff)"
              />
              <layers-customization-control
                title="Строения"
                :enabled-controls="['color', 'opacity']"
                :change-handler="(type, diff) => changeColor(['building'], type, diff)"
              />
            </div>
          </yandex-map-control>
        </yandex-map-controls>
      </yandex-map>
      <textarea class="editor" :value="JSON.stringify(customization, undefined, 2)" @change="(e) => changeCustomization(e as InputEvent)" />
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap, YandexMapControl, YandexMapControls, YandexMapDefaultSchemeLayer,
} from 'vue-yandex-maps';
import type { CustomizationControls } from './LayersCustomizationControl.vue';
import LayersCustomizationControl from './LayersCustomizationControl.vue';
import type {
  VectorCustomization,
  VectorCustomizationItem,
} from '@yandex/ymaps3-types';
import { shallowRef, triggerRef } from 'vue';

const customization = shallowRef<VectorCustomization>([
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

const changeCustomization = (event: InputEvent) => {
  try {
    customization.value = JSON.parse((event.target as HTMLTextAreaElement).value);
  } catch (e) {
    console.error(e);
  }
};

// Function generates a random color in HEX format
const generateColor = () => `#${Math.floor(Math.random() * 16777215)
  .toString(16)}`;

const changeColor = (controlTags: string[], type: CustomizationControls, diff?: number) => {
  const customizationObject = customization.value.find(
    (item: any) => typeof item.tags === 'object' && JSON.stringify(item.tags.any) === JSON.stringify(controlTags),
  );

  if (type === 'color') {
    if (customizationObject) {
      (customizationObject.stylers as any[])[0].color = generateColor();
    } else {
      const newTagObject: VectorCustomizationItem = {
        tags: { any: controlTags },
        elements: 'geometry',
        stylers: [{ color: generateColor() }],
      };

      customization.value.push(newTagObject);
    }
  } else if (type === 'opacity') {
    if (!customizationObject) {
      const newTagObject: VectorCustomizationItem = {
        tags: { any: controlTags },
        elements: 'geometry',
        stylers: [{ opacity: 0.5 }],
      };
      customization.value.push(newTagObject);
    } else if (Array.isArray(customizationObject.stylers)) {
      if (customizationObject.stylers[0].opacity === undefined) {
        customizationObject.stylers[0].opacity = 0.5;
      } else {
        customizationObject.stylers[0].opacity = +(customizationObject.stylers[0].opacity + diff!).toFixed(
          1,
        );

        if (customizationObject.stylers[0].opacity > 1) customizationObject.stylers[0].opacity = 1;
        if (customizationObject.stylers[0].opacity < 0) customizationObject.stylers[0].opacity = 0;
      }
    }
  } else if (type === 'scale') {
    if (!customizationObject) {
      const newTagObject: VectorCustomizationItem = {
        tags: { any: controlTags },
        elements: 'geometry',
        stylers: [{ scale: 2 }],
      };
      customization.value.push(newTagObject);
    } else if (Array.isArray(customizationObject.stylers)) {
      if (customizationObject.stylers[0].scale === undefined) {
        customizationObject.stylers[0].scale = 2;
      } else {
        customizationObject.stylers[0].scale = Math.floor(customizationObject.stylers[0].scale + diff!);
      }
    }
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

.controls {
  overflow: auto;
  max-height: calc(var(--map-height) - 24px);
}

.editor {
  width: 100%;
  min-height: 300px;
  margin-top: 20px;
  padding: 10px;
}
</style>
<!-- #endregion style -->
