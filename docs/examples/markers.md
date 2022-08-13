# Маркеры

<client-only>
  <YandexMarkers />
</client-only>

```vue
<template>
  <yandex-map :coordinates="coordinates">
    <yandex-marker :coordinates="coordinates" :marker-id="123">
      <template #component>
        <CustomBalloon v-model="name" />
      </template>
    </yandex-marker>
  </yandex-map>
</template>

<script setup>
import { ref } from 'vue';
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
