<script lang="ts">
import { defineComponent } from 'vue';
import {
  YandexMap,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer,
  YandexMapGeolocationControl,
  YandexMapHint,
  YandexMapListener,
  YandexMapMarker,
  YandexMapZoomControl,
} from 'vue-yandex-maps';

export default defineComponent({
  components: {
    YandexMapMarker,
    YandexMapDefaultMarker,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    YandexMapListener,
    YandexMap,
    YandexMapControls,
    YandexMapGeolocationControl,
    YandexMapZoomControl,
    YandexMapHint,
  },
  data() {
    return {
      markerValue: 'Click me to change',
    };
  },
  methods: {
    changeMarkerText() {
      this.markerValue = 'I\'ve changed!';
    },
    logMapClick(e: any) {
      console.log(e);
    },
  },
});
</script>

<template>
  <div id="__app">
    <yandex-map width="50dvw" height="75dvh" :settings="{ location: { center: [37.588144, 55.733842], zoom: 7 } }">
      <yandex-map-listener :settings="{ onClick: logMapClick }"/>
      <yandex-map-default-scheme-layer :settings="{ theme: 'dark' }"/>
      <yandex-map-default-features-layer/>
      <yandex-map-marker
          :settings="{ coordinates: [37.588144, 55.733842], properties: { hint: markerValue }, onClick: changeMarkerText }"
      >
        <span style="color: #fff">
          {{ markerValue }}
        </span>
      </yandex-map-marker>
      <yandex-map-default-marker
          :settings="{
            coordinates: [38.588144, 56.733842],
            title: markerValue,
            subtitle: 'Subtitle',
            color: 'blue',
            properties: { hint: 'Default Hint' },
            onClick: changeMarkerText
          }"
      />
      <yandex-map-default-marker
          :settings="{
            coordinates: [36.588144, 54.733842],
            title: 'I have reactive popup!',
            color: 'red',
            popup: {
              content: 'fromSlot',
              position: 'top',
            },
          }"
      >
        <template #popup="{close}">
          <div class="hint" @click="close()">
            Click here to close me!
          </div>
        </template>
      </yandex-map-default-marker>
      <yandex-map-controls :settings="{ position: 'top left', orientation: 'vertical' }">
        <yandex-map-geolocation-control/>
        <yandex-map-zoom-control/>
      </yandex-map-controls>
      <yandex-map-controls :settings="{ position: 'top right', orientation: 'horizontal' }">
        <yandex-map-geolocation-control/>
        <yandex-map-zoom-control/>
      </yandex-map-controls>
      <yandex-map-hint hint-property="hint">
        <template #default="{ content }">
          <div class="hint">
            {{ content }}
          </div>
        </template>
      </yandex-map-hint>
    </yandex-map>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#__app {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hint {
  background: #fff;
  border-radius: 10px;
  color: #000;
  padding: 10px;
}
</style>
