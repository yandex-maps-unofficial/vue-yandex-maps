<template>
  <YandexMap :coordinates="coordinates">
    <YandexClusterer :options="{ preset: 'islands#invertedRedClusterIcons' }">
      <YandexMarker
        v-for="i in 10"
        :key="`1-marker-${i}`"
        :coordinates="getCoordinates()"
        :marker-id="`1-marker-${i}`"
      />
    </YandexClusterer>
    <YandexClusterer :options="{ preset: 'islands#nightClusterIcons' }">
      <YandexMarker
        v-for="i in 10"
        :key="`1-marker-${i}`"
        :coordinates="getCoordinates()"
        :marker-id="`1-marker-${i}`"
      />
    </YandexClusterer>
  </YandexMap>
</template>

<script setup>
import { ref } from 'vue';
import YandexMap from '../../src/Map';
import YandexMarker from '../../src/Marker';
import YandexClusterer from '../../src/Clusterer';

const coordinates = ref([55, 33]);
const getCoordinates = () => [55 + Math.random(), 33 + Math.random()];
</script>

<style>
.yandex-container {
  height: 400px;
}

.yandex-balloon {
  height: 200px;
  width: 200px;
}
</style>
