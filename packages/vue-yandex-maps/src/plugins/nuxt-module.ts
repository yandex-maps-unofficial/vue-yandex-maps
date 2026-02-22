import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';
import { join, relative } from 'path';
import type { YandexMapNuxtModuleSettings } from '../utils/init.ts';
import type { NuxtModule } from 'nuxt/schema';

// Module options TypeScript interface definition
interface ModuleOptions extends YandexMapNuxtModuleSettings {
}

declare module '@nuxt/schema' {
    interface NuxtConfig {
        ['yandexMaps']?: Partial<ModuleOptions>;
    }

    interface NuxtOptions {
        ['yandexMaps']?: ModuleOptions;
    }

    interface PublicRuntimeConfig {
        yandexMaps: YandexMapNuxtModuleSettings;
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
        yandexMaps: YandexMapNuxtModuleSettings;
    }
}

const _default: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'vue-yandex-maps',
        configKey: 'yandexMaps',
        compatibility: {
            nuxt: '>=3.12.0',
        },
    },
    setup(options, nuxt) {
        if (!nuxt.options.runtimeConfig) {
            nuxt.options.runtimeConfig = {
                app: {},
                // @ts-expect-error Types error
                public: {},
            };
        }

        // @ts-expect-error Types error
        if (!nuxt.options.runtimeConfig.public) nuxt.options.runtimeConfig.public = {};

        nuxt.options.runtimeConfig.public.yandexMaps = {
            ...options,
            ...(nuxt.options.runtimeConfig.public.yandexMaps ?? {}),
        };

        if (!nuxt.options.build.transpile) nuxt.options.build.transpile = [];
        nuxt.options.build.transpile.push('vue-yandex-maps');

        if (!nuxt.options.vite) nuxt.options.vite = {};
        if (!nuxt.options.vite.optimizeDeps) nuxt.options.vite.optimizeDeps = {};
        if (!nuxt.options.vite.optimizeDeps.exclude) nuxt.options.vite.optimizeDeps.exclude = [];
        nuxt.options.vite.optimizeDeps.exclude.push('vue-yandex-maps');

        if (nuxt.options.runtimeConfig.public.yandexMaps.typesInjection !== false) {
            nuxt.hook('prepare:types', ({ tsConfig }) => {
                let typeRoots = tsConfig.compilerOptions!.typeRoots as string[] | undefined;
                if (!typeRoots) {
                    tsConfig.compilerOptions!.typeRoots = [];
                    typeRoots = tsConfig.compilerOptions!.typeRoots;
                }

                const path = relative(nuxt.options.buildDir, nuxt.options.rootDir);

                if (!typeRoots?.some(x => x.endsWith('@types'))) {
                    typeRoots!.push(join(path, 'node_modules/@types'));
                }

                if (!typeRoots?.some(x => x.endsWith('@yandex/ymaps3-types'))) {
                    typeRoots!.push(join(path, 'node_modules/@yandex/ymaps3-types'));
                }
            });
        }

        addPlugin({
            src: createResolver(import.meta.url)
                .resolve('./nuxt-plugin'),
        });
    },
});


export { type ModuleOptions, _default as default };
