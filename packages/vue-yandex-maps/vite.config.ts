import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
    optimizeDeps: {
        exclude: ['vue'],
    },
    build: {
        minify: false,
        sourcemap: false,
        outDir: 'dist',
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
        },
        rollupOptions: {
            external: ['vue', 'path', 'nuxt', 'nuxt/app', '#app', '@nuxt/kit'],
            input: {
                'vue-yandex-maps': resolve(__dirname, 'src/index.ts'),
                'plugins/nuxt-module': resolve(__dirname, 'src/plugins/nuxt-module'),
                'plugins/nuxt-plugin': resolve(__dirname, 'src/plugins/nuxt-plugin'),
            },
            output: {
                format: 'es',
                esModule: true,
                globals: {
                    vue: 'Vue',
                },
                chunkFileNames: 'vue-yandex-maps-[hash].js',
                entryFileNames: '[name].js',
            },
        },
    },
    plugins: [
        del({ targets: 'dist/*' }),
        vue(),
        libInjectCss(),
        dts(),
        copy({
            targets: [
                {
                    src: ['../../README.md', '../../LICENSE'],
                    dest: './',
                },
            ],
            hook: 'writeBundle',
        }),
    ],
});
