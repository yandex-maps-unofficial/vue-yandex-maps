<template>
  <div class="wrapper" style="margin-top: 20px">
    <slot
      :coordinates="([37.617644, 55.755819] satisfies LngLat)"
      :zoom="9"
      :width="'100%'"
      :height="'500px'"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import type { LngLat } from '@yandex/ymaps3-types';
import { createYmapsOptions, VueYandexMaps } from 'vue-yandex-maps';
import { computed } from 'vue';

const theme = computed<'light' | 'dark'>(() => {
  if (typeof window === 'undefined') return 'light';

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
});

if (!VueYandexMaps.settings.value.apikey) {
  createYmapsOptions({
    apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
  });
}
</script>
