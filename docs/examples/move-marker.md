# Перемещение маркера по клику

<client-only>
  <MapWithMarker />
</client-only>

```vue
<template>
  <YandexMap :coordinates="coordinates" @click="onClick">
    <YandexMarker :coordinates="coordinates" :marker-id="123" />
  </YandexMap>
</template>

<script setup>
import { ref } from 'vue';
import { yandexMap, yandexMarker } from 'vue-yandex-maps'

const coordinates = ref([55, 33]);
const onClick = (e) => (coordinates.value = e.get('coords'));
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
