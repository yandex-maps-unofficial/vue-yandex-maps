import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';
import { join, relative } from 'path';
import type { VueYandexMaps } from '../namespace.ts';
import type { NuxtModule } from 'nuxt/schema';

// Module options TypeScript interface definition
interface ModuleOptions extends VueYandexMaps.PluginSettings {
}

declare module '@nuxt/schema' {
    interface NuxtConfig {
        ['yandexMaps']?: Partial<ModuleOptions>;
    }

    interface NuxtOptions {
        ['yandexMaps']?: ModuleOptions;
    }

    interface PublicRuntimeConfig {
        yandexMaps: VueYandexMaps.PluginSettings;
    }
}

declare module 'nuxt/schema' {
    interface NuxtConfig {
        ['yandexMaps']?: Partial<ModuleOptions>;
    }

    interface NuxtOptions {
        ['yandexMaps']?: ModuleOptions;
    }

    interface PublicRuntimeConfig {
        yandexMaps: VueYandexMaps.PluginSettings;
    }
}

const _default: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'vue-yandex-maps',
        configKey: 'yandexMaps',
        compatibility: {
            bridge: true,
        },
    },
    setup(options, nuxt) {
        if (!nuxt.options.runtimeConfig) {
            nuxt.options.runtimeConfig = {
                // @ts-expect-error Types error
                app: {},
                // @ts-expect-error Types error
                public: {},
            };
        }

        // @ts-expect-error Types error
        if (!nuxt.options.runtimeConfig.public) nuxt.options.runtimeConfig.public = {};

        nuxt.options.runtimeConfig.public.yandexMaps = options;

        if (!nuxt.options.build.transpile) nuxt.options.build.transpile = [];
        nuxt.options.build.transpile.push('vue-yandex-maps');

        if (!nuxt.options.vite) nuxt.options.vite = {};
        if (!nuxt.options.vite.optimizeDeps) nuxt.options.vite.optimizeDeps = {};
        if (!nuxt.options.vite.optimizeDeps.exclude) nuxt.options.vite.optimizeDeps.exclude = [];
        nuxt.options.vite.optimizeDeps.exclude.push('vue-yandex-maps');

        nuxt.hook('prepare:types', ({ tsConfig }) => {
            let typeRoots = tsConfig.compilerOptions!.typeRoots as string[] | undefined;
            if (!typeRoots) {
                tsConfig.compilerOptions!.typeRoots = [];
                typeRoots = tsConfig.compilerOptions!.typeRoots;
            }

            const path = relative(nuxt.options.buildDir, nuxt.options.rootDir);

            typeRoots!.push(join(path, 'node_modules/@types'));
            typeRoots!.push(join(path, 'node_modules/@yandex/ymaps3-types'));

            if (!tsConfig.compilerOptions!.types) tsConfig.compilerOptions!.types = [];
            tsConfig.compilerOptions!.types.push('vue-yandex-maps');
        });

        addPlugin({
            src: createResolver(import.meta.url)
                .resolve('./nuxt3-plugin'),
        });
    },
});


export { type ModuleOptions, _default as default };
