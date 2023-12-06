import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { createYmapsOptions } from '../composables/init.ts';

export default defineNuxtPlugin(() => {
  createYmapsOptions(useRuntimeConfig().public.yandexMaps);
});
