// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
    vite: {
        ssr: {
            noExternal: ['vue-yandex-maps'],
        },
    },
    integrations: [vue({ appEntrypoint: '/src/init' })],
});
