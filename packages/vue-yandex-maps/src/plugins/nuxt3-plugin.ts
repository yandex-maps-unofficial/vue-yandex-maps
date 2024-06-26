import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { createYmapsOptions, initYmaps } from '../functions';

export default defineNuxtPlugin({
    async setup() {
        const settings = useRuntimeConfig().public.yandexMaps;
        createYmapsOptions(settings);
        if (import.meta.client && settings.initializeOn === 'onPluginInit') {
            initYmaps().catch(console.error);
        }
    },
});
