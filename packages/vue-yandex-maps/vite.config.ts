import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import copy from 'rollup-plugin-copy';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
    build: {
        minify: false,
        sourcemap: false,
        outDir: 'dist',
        emptyOutDir: false,
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            cssFileName: 'vue-yandex-maps',
        },
        rolldownOptions: {
            external: ['vue', 'path', 'nuxt', 'nuxt/app', '#app', '@nuxt/kit', '#core'],
            input: {
                index: resolve(import.meta.dirname, 'src/index.ts'),
                'plugins/nuxt-module': resolve(import.meta.dirname, 'src/plugins/nuxt-module.ts'),
                'plugins/nuxt-plugin': resolve(import.meta.dirname, 'src/plugins/nuxt-plugin.ts'),
            },
            output: {
                format: 'es',
                esModule: true,
                entryFileNames: '[name].js',
                chunkFileNames: 'vue-yandex-maps-[hash].js',
            },
        },
    },
    plugins: [
        vue(),
        libInjectCss(),
        dts({ processor: 'vue' }),
        copy({
            targets: [{
                src: ['../../README.md', '../../LICENSE'],
                dest: './',
            }],
            hook: 'writeBundle',
        }),
    ],
});
