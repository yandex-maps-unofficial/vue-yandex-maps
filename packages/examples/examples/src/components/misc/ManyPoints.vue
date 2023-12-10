<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        v-model="map"
        :settings="{
          location: {
            center,
            zoom: 5,
          },
        }"
        :width="width"
        :height="height"
        real-settings-location
      >
        <yandex-map-default-scheme-layer :settings="{ theme }" />
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'top left' }">
          <yandex-map-control>
            <label style="padding: 5px">
              Elements count: {{ count }}
              <input
                v-model="count"
                type="range"
                min="100"
                max="5000"
                step="100"
              >
            </label>
            <label style="padding: 5px">
              Grid Size: {{ 2 ** gridSize }}
              <input
                :value="gridSize"
                type="range"
                min="6"
                max="11"
                @input="gridSize = $event.target.value"
              >
            </label>
          </yandex-map-control>
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
        <yandex-map-clusterer
          v-model="clusterer"
          :grid-size="2 ** gridSize"
          zoom-on-cluster-click
        >
          <yandex-map-marker
            v-for="(coordinates) in getPointList"
            :key="coordinates.join(',')"
            :settings="{
              coordinates,
              onClick: () => background = background === 'red' ? 'green' : 'red',
            }"
          >
            <div
              :style="{
                background, borderRadius: '100%', width: '20px', height: '20px',
              }"
            />
          </yandex-map-marker>
          <template #cluster="{ length }">
            <div
              class="cluster"
              :style="{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '50px',
                aspectRatio: '1/1',
                background: 'green',
                color: '#fff',
                borderRadius: '100%',
                cursor: 'pointer',
              }"
            >
              {{ length }}
            </div>
          </template>
        </yandex-map-clusterer>
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
  YandexMapClusterer,
  YandexMapControl,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapMarker,
  YandexMapDefaultSchemeLayer,
  YandexMapZoomControl,
} from 'vue-yandex-maps';
import {
  computed, ref, shallowRef, watch,
} from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import type { YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';

const map = shallowRef<YMap | null>(null);
const clusterer = shallowRef<YMapClusterer | null>(null);
const count = ref(100);
const savedCount = ref(100);
const gridSize = ref(6);
const background = ref('red');

watch(count, async (val) => {
  const oldVal = val;
  setTimeout(() => {
    if (oldVal !== count.value) return;
    savedCount.value = val;
  }, 500);
});

watch(map, (val) => console.log('map', val));
watch(clusterer, (val) => console.log('cluster', val));

const seed = (s: number) => () => {
  s = Math.sin(s) * 10000;
  return s - Math.floor(s);
};

const rnd = seed(10000);

const DELTA_LENGTH = 5;

function getRandomPoint() {
  const [x, y] = map.value!.center;
  return [x + (rnd() > 0.5 ? -1 : 1) * rnd() * DELTA_LENGTH * 2, y + (rnd() > 0.5 ? -1 : 1) * rnd() * DELTA_LENGTH];
}

const getPointList = computed(() => {
  if (!map.value) return [];
  const result = [];

  for (let i = 0; i < savedCount.value; i++) {
    result.push(getRandomPoint());
  }

  return result;
});

// #endregion setup
</script>
