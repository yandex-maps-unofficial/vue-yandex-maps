# Маркер с кастомным балуном

<client-only>
  <MarkerWithCastomBalloon />
</client-only>

### Map
```vue
<template>
  <YandexMap :coordinates="coordinates">
    <YandexMarker :coordinates="coordinates" :marker-id="123">
      <template #component>
        <CustomBalloon v-model="name" />
      </template>
    </YandexMarker>
  </YandexMap>
</template>

<script setup>
import { ref } from 'vue';
import { yandexMap, yandexMarker } from 'vue-yandex-maps'
import CustomBalloon from './CustomBalloon.vue';

const coordinates = [55, 33];
const name = ref('Custom');
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
### CustomBalloon
```vue
<template>
  <div>
    {{ modelValue }} component with props and emits
    <button @click="$emit('update:modelValue', 'Awesome')">Click!</button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);
</script>
```
