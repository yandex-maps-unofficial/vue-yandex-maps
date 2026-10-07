import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        minify: false,
        sourcemap: false,
        outDir: 'dist',
        emptyOutDir: true,
        lib: {
            entry: 'src/core.ts',
            formats: ['es'],
        },
        rolldownOptions: {
            external: ['vue', 'path', 'nuxt', 'nuxt/app', '#app', '@nuxt/kit'],
            input: {
                core: resolve(import.meta.dirname, 'src/core.ts'),
            },
            output: {
                format: 'es',
                esModule: true,
                entryFileNames: '[name].js',
                chunkFileNames: 'vue-yandex-maps-[hash].js',
            },
        },
    },
});
