<script lang="ts">
import { defineComponent } from 'vue';
import {
  YandexMap,
  YandexMapClusterer,
  YandexMapCollection,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer,
  YandexMapGeolocationControl,
  YandexMapHint,
  YandexMapListener,
  YandexMapMarker,
  YandexMapOpenMapsButton,
  YandexMapZoomControl,
} from 'vue-yandex-maps';

const clusterCoordinates: [number, number][] = [
  [37.64, 55.76],
  [37.63, 55.7],
  [37.43, 55.69],
  [37.47, 55.68],
  [38.53, 58.6],
  [37.59, 55.71],
  [37.5, 55.63],
  [37.52, 55.57],
  [37.52, 58.57],
  [40.52, 58.57],
];

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
    YandexMapOpenMapsButton,
    YandexMapClusterer,
    YandexMapCollection,
  },
  data() {
    return {
      markerValue: 'Click me to change',
      clusterCoordinates,
    };
  },
  methods: {
    changeMarkerText() {
      this.markerValue = 'I\'ve changed!';
      this.clusterCoordinates.shift();
      console.log(this.clusterCoordinates);
    },
    logMapClick(e: any) {
      console.log(e);
    },
    collection(e: any) {
      console.log('collection', e);
    },
  },
});
</script>

<template>
  <div id="__app">
    <yandex-map width="50dvw" height="75dvh" :settings="{ location: { center: [37.588144, 55.733842], zoom: 7 } }">
      <yandex-map-listener :settings="{ onClick: logMapClick }" />
      <yandex-map-default-scheme-layer :settings="{ theme: 'dark' }" />
      <yandex-map-default-features-layer />
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
          onClick: changeMarkerText,
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
        <template #popup="{ close }">
          <div class="hint" @click="close()">
            Click here to close me!
          </div>
        </template>
      </yandex-map-default-marker>
      <yandex-map-controls :settings="{ position: 'top left', orientation: 'vertical' }">
        <yandex-map-collection @input="collection">
          <yandex-map-geolocation-control />
          <yandex-map-zoom-control />
          <yandex-map-open-maps-button :settings="{ title: 'This button will open Yandex Maps' }" />
        </yandex-map-collection>
      </yandex-map-controls>
      <yandex-map-controls :settings="{ position: 'top right', orientation: 'horizontal' }">
        <yandex-map-geolocation-control />
        <yandex-map-zoom-control />
      </yandex-map-controls>
      <yandex-map-hint hint-property="hint">
        <template #default="{ content }">
          <div class="hint">
            {{ content }}
          </div>
        </template>
      </yandex-map-hint>
      <yandex-map-clusterer>
        <yandex-map-marker
          v-for="(coordinates, index) in clusterCoordinates"
          :key="index"
          :settings="{ coordinates, properties: { hint: `Cluster Marker` } }"
        >
          <div class="hint">
            Cluster Marker #{{ index }}
          </div>
        </yandex-map-marker>
        <template #cluster="{ length }">
          <div class="cluster">
            {{ length }}
          </div>
        </template>
      </yandex-map-clusterer>
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

.cluster {
  background: black;
  padding: 20px;
  aspect-ratio: 1/1;
  color: #fff;
  border-radius: 100%;
}
</style>
