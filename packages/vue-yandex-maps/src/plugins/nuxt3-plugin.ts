import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { createYmapsOptions } from '../composables/maps.ts';

export default defineNuxtPlugin(() => {
  createYmapsOptions(useRuntimeConfig().public.yandexMaps);
});
