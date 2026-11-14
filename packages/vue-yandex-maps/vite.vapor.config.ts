import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    build: {
        minify: false,
        sourcemap: false,
        outDir: 'dist',
        emptyOutDir: false,
        lib: {
            entry: 'src/vapor.ts',
            formats: ['es'],
            cssFileName: 'vue-yandex-maps',
        },
        rolldownOptions: {
            external: [
                'vue',
                'path',
                'nuxt',
                'nuxt/app',
                '#app',
                '@nuxt/kit',
                '#core',
                '@yandex/ymaps3-cartesian-projection',
                '@yandex/ymaps3-web-mercator-projection',
                '@yandex/ymaps3-world-utils',
            ],
            input: {
                vapor: resolve(import.meta.dirname, 'src/vapor.ts'),
            },
            output: {
                format: 'es',
                esModule: true,
                banner: chunk => chunk.isEntry ? `import 'vue-yandex-maps/css';` : '',
                entryFileNames: '[name].js',
                chunkFileNames: 'vapor/vue-yandex-maps-[hash].js',
            },
        },
    },
    plugins: [
        vue({ features: { vapor: true } }),
    ],
});
