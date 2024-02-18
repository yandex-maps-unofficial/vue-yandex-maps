<template>
  <common-wrapper>
    <template
      #default="{
        theme, width, height,
      }"
    >
      <!-- #region html -->
      <!-- Параметр real-settings-location в примере вызывает изменение геопозиции на каждое изменение settings. -->
      <!-- Ознакомьтесь с документацией компонента YandexMap, чтобы узнать больше, зачем он нужен и какие подводные камни -->
      <yandex-map
        v-model="map"
        :settings="{
          location: {
            ...LOCATION,
            duration: 2500,
          },
          camera,
          theme,
          showScaleInCopyrights: true,
        }"
        real-settings-location
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer />

        <yandex-map-controls :settings="{ position: 'bottom left' }">
          <template v-if="!locationChanged">
            <yandex-map-control-button :settings="{ onClick: () => [LOCATION = NEW_LOCATION_CENTER, camera.tilt = (45 * Math.PI) / 180, locationChanged = true] }">
              Изменить Center
            </yandex-map-control-button>
            <yandex-map-control-button :settings="{ onClick: () => [LOCATION = NEW_LOCATION_BOUNDS, camera.tilt = (45 * Math.PI) / 180, locationChanged = true] }">
              Изменить Bounds
            </yandex-map-control-button>
          </template>
          <yandex-map-control-button v-else :settings="{ onClick: () => [LOCATION = OLD_LOCATION, camera.tilt = 0, locationChanged = false] }">
            Вернуться назад
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
  YandexMap,
  YandexMapControlButton,
  YandexMapControls,
  YandexMapDefaultSchemeLayer,
} from 'vue-yandex-maps';
import { ref, shallowRef, watch } from 'vue';
import type { YMap, YMapCameraRequest } from '@yandex/ymaps3-types';
import type { YMapLocationRequest } from '@yandex/ymaps3-types/imperative/YMap';

const map = shallowRef<YMap | null>(null);
const locationChanged = ref(false);

const camera = ref<YMapCameraRequest>({
  duration: 2500,
});

const LOCATION = ref<YMapLocationRequest>({
  center: [37.623082, 55.75254], // starting position [lng, lat]
  zoom: 5, // starting zoom
});

const OLD_LOCATION = ref<YMapLocationRequest>(LOCATION.value);

watch(LOCATION, (_, oldValue) => {
  OLD_LOCATION.value = oldValue;
});

const NEW_LOCATION_CENTER: YMapLocationRequest = {
  center: [2.294587, 48.859958], // [lng, lat]
  zoom: 16.6,
};

const NEW_LOCATION_BOUNDS: YMapLocationRequest = {
  bounds: [
    [-74.045667, 40.690044], // bounds - the boundaries of the visible area of the map
    [-74.043567, 40.688628], // [[lng, lat], [lng, lat]].
  ],
  zoom: 16.6,
};
// #endregion setup
</script>
