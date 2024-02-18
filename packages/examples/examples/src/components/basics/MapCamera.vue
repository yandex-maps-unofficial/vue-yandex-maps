<template>
  <common-wrapper>
    <template
      #default="{
        theme, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        v-model="map"
        :settings="{
          location: {
            center: [37.537, 55.749],
            zoom: 17,
          },
          camera: { azimuth: mapAzimuth, tilt: mapTilt, duration: hasAutoRotate ? 0 : 250 },
          theme,
          showScaleInCopyrights: true,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-listener :settings="{ onActionStart: () => hasAutoRotate = false }" />
        <yandex-map-controls :settings="{ position: 'top' }">
          <yandex-map-control-button :settings="{ color: '#fff', background: hasAutoRotate ? '#fd6466e6' : '#007afce6', onClick: () => hasAutoRotate = !hasAutoRotate }">
            Авто-поворот
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: () => updateCamera('azimuth', 'minus') }">
            Поворот влево
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: () => updateCamera('azimuth', 'plus') }">
            Поворот вправо
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: () => updateCamera('tilt', 'minus') }">
            Наклон наверх
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: () => updateCamera('tilt', 'plus') }">
            Наклон вниз
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
  YandexMap, YandexMapDefaultSchemeLayer, YandexMapListener, YandexMapControls, YandexMapControlButton,
} from 'vue-yandex-maps';
import {
  nextTick,
  onBeforeUnmount, ref, shallowRef, watch,
} from 'vue';
import type { YMap } from '@yandex/ymaps3-types';

const hasAutoRotate = ref(true);
const mapAzimuth = ref(0);
const mapTilt = ref((40 * Math.PI) / 180);
const frame = ref<null | number>(null);
const map = shallowRef<YMap | null>(null);

// Automatically rotate the camera
const startAutoRotationCamera = () => {
  if (!map.value) return;

  if (hasAutoRotate.value) {
    //  Divide degrees by 100 to slow rotation to ~20 degrees / sec
    mapAzimuth.value = (map.value.azimuth + (10 * Math.PI) / 180 / 100);
    // Request the next frame of the animation
    frame.value = requestAnimationFrame(startAutoRotationCamera);

    // If the automatic rotation mode is stopped then cancel the request for the next animation frame
  } else if (frame.value) cancelAnimationFrame(frame.value);
};

watch([hasAutoRotate, map], () => {
  if (typeof requestAnimationFrame === 'undefined') return;
  requestAnimationFrame(startAutoRotationCamera);
}, {
  immediate: true,
});

onBeforeUnmount(() => {
  if (frame.value) {
    hasAutoRotate.value = false;
    cancelAnimationFrame(frame.value);
  }
});

const updateCamera = async (type: 'azimuth' | 'tilt', direction: 'minus' | 'plus') => {
  hasAutoRotate.value = false;
  await nextTick();
  if (frame.value) cancelAnimationFrame(frame.value);

  mapAzimuth.value = map.value!.azimuth;
  mapTilt.value = map.value!.tilt;

  switch (type) {
    case 'azimuth':
      mapAzimuth.value = map.value!.azimuth + (30 * Math.PI) / (180 * (direction === 'minus' ? -1 : 1));
      break;
    case 'tilt':
      mapTilt.value = map.value!.tilt + (10 * Math.PI) / (180 * (direction === 'minus' ? -1 : 1));
      break;
    default:
  }
};
// #endregion setup
</script>
