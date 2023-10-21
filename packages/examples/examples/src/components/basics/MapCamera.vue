<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        v-model="map"
        :settings="{
          ...settings,
          location: settings.location || {
            center,
            zoom,
          },
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer :settings="{ theme }" />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-geolocation-control />
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'top left' }">
          <yandex-map-control-button :settings="{ onClick: changeCenter }">
            Smoothly move the center
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: changeAzimuthRight }">
            Smooth camera counterclockwise
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: changeAzimuthLeft }">
            Smooth camera clockwise
          </yandex-map-control-button>
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'left' }">
          <yandex-map-control-button :settings="{ onClick: upTilt }">
            Raise the camera
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: downTilt }">
            Tilt the camera
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: flyAway }">
            Fly
          </yandex-map-control-button>
          <yandex-map-control-button :settings="{ onClick: byMouse }">
            Mouse control
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
  YandexMapGeolocationControl,
  YandexMapSettings,
} from 'vue-yandex-maps';
import {
  onMounted, reactive, ref, shallowRef,
} from 'vue';
import type { LngLat, YMap, YMapCenterZoomLocation } from '@yandex/ymaps3-types';
import type { YMapCameraRequest, YMapLocation } from '@yandex/ymaps3-types/imperative/YMap';

const map = shallowRef<YMap | null>(null);

const LOCATION: YMapLocation = {
  center: [37.623082, 55.75254],
  zoom: 9,
};
const NEW_LOCATION: YMapLocation = {
  center: [42.623082, 57.75254],
  zoom: 7,
};

function rangeRandom(min: number, max: number) {
  return (max - min) * Math.random() + min;
}

type StateFly = YMapCenterZoomLocation & Partial<YMapCameraRequest>

const state = reactive({
  resetByMouse: null as null | Function,
  location: true,
  fly: null as null | StateFly,
});

const settings = reactive<Partial<YandexMapSettings>>({
  camera: {
    tilt: 0,
    azimuth: 0,
    duration: 0,
  },
});

const changeCenter = () => {
  settings.location = {
    ...state.location ? NEW_LOCATION : LOCATION,
    duration: 1000,
  };
};

const rotateCamera = (angle: number) => {
  settings.camera = {
    ...settings.camera,
    azimuth: map.value!.azimuth + angle,
    duration: 1000,
  };
};

const tiltCamera = (angle: number) => {
  settings.camera = {
    ...settings.camera,
    tilt: map.value!.tilt + angle,
    duration: 1000,
  };
};

const changeAzimuthLeft = () => rotateCamera(Math.PI / 4);
const changeAzimuthRight = () => rotateCamera(-Math.PI / 4);

const downTilt = () => tiltCamera(Math.PI / 4);
const upTilt = () => tiltCamera(-Math.PI / 4);

const flyAway = () => {
  const previousPoint: StateFly = state.fly ? { ...state.fly } : {
    center: [rangeRandom(30, 50), rangeRandom(30, 50)],
    zoom: Math.round(rangeRandom(4, 9)),
    azimuth: map.value!.azimuth + Math.random() * Math.PI,
    tilt: map.value!.tilt + Math.random() * Math.PI,
  };

  state.fly = {
    center: map.value!.center as LngLat,
    zoom: map.value!.zoom,
    tilt: map.value!.tilt,
    azimuth: map.value!.azimuth,
  };

  settings.location = {
    center: previousPoint.center,
    zoom: previousPoint.zoom,
    duration: 1000,
  };

  settings.camera = previousPoint;
};

const lock = ref(false);
const byMouse = () => {
  if (state.resetByMouse) return state.resetByMouse();

  const onMouseMove = (e: MouseEvent) => {
    if (!lock.value) {
      settings.camera = {
        tilt: ((e.clientY / 2) / window.innerHeight) * Math.PI,
        azimuth: (e.clientX / window.innerWidth) * Math.PI,
      };
    }
  };

  window.addEventListener('mousemove', onMouseMove);

  state.resetByMouse = () => {
    state.resetByMouse = null;
    window.removeEventListener('mousemove', onMouseMove);
  };
};

onMounted(() => {
  const onMouseDown = () => {
    lock.value = true;
  };
  const onMouseUp = () => {
    lock.value = false;
  };

  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
});

// #endregion setup
</script>
