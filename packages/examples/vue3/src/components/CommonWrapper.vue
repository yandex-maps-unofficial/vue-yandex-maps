<template>
  <slot />
</template>

<script setup lang="ts">
import { createYmapsOptions, VueYandexMaps } from 'vue-yandex-maps';

if (!VueYandexMaps.settings.value.apikey) {
  createYmapsOptions({
    apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
  });
}
</script>
