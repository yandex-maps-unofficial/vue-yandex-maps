# Создание карты

<client-only>
  <YandexMap />
</client-only>

```vue
<template>
  <YandexMap
    :coordinates="coordinates"
    :detailed-controls="detailedControls"
    :controls="controls"
    map-type="hybrid"
  />
</template>

<script setup>
import { yandexMap } from 'vue-yandex-maps'
const coordinates = [55, 33];
const controls = ['fullscreenControl'];
const detailedControls = { zoomControl: { position: { right: 10, top: 50 } } };
</script>

<style>
.yandex-container {
  height: 400px;
}
</style>
```
