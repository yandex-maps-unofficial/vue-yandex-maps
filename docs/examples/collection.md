# Использование коллекций

<client-only>
  <YandexCollection />
</client-only>

```vue
<template>
  <YandexMap :coordinates="coordinates">
    <YandexCollection :options="{ preset: 'islands#redCircleIcon' }">
      <YandexMarker
        v-for="i in 10"
        :key="`1-marker-${i}`"
        :coordinates="getCoordinates()"
        :marker-id="`1-marker-${i}`"
      />
    </YandexCollection>
    <YandexCollection :options="{ preset: 'islands#blueAutoIcon' }">
      <YandexMarker
        v-for="i in 10"
        :key="`1-marker-${i}`"
        :coordinates="getCoordinates()"
        :marker-id="`1-marker-${i}`"
      />
    </YandexCollection>
  </YandexMap>
</template>

<script setup>
import { ref } from 'vue';
import { yandexMap, yandexMarker, yandexCollection } from 'vue-yandex-maps'

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

```
