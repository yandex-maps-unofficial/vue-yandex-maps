<template>
  <div class="vue-yandex-maps-wrapper">
    <!-- @vue-ignore -->
    <slot
      :coordinates="coordinates"
      :zoom="9"
      :width="'100%'"
      :height="'500px'"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { createYmapsOptions, VueYandexMaps } from 'vue-yandex-maps';
import { computed } from 'vue';
import type { LngLat } from '@yandex/ymaps3-types';

const theme = computed<'light' | 'dark'>(() => {
  if (typeof window === 'undefined') return 'light';

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
});

const coordinates: LngLat = [37.617644, 55.755819];

if (!VueYandexMaps.settings.value.apikey) {
  createYmapsOptions({
    apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
  });
}
</script>

<style>
.vue-yandex-maps-wrapper {
  margin-top: 20px
}

.vue-yandex-maps-wrapper * {
  line-height: normal;
}

.vue-yandex-maps-wrapper .__ymap {
  border-radius: 8px;
  overflow: hidden;
}
</style>
