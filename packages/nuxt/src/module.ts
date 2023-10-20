import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';
import { VueYandexMaps } from 'vue-yandex-maps';
import { join, relative } from 'path';

// Module options TypeScript interface definition
export interface ModuleOptions extends VueYandexMaps.PluginSettings {
}

export interface ModulePublicRuntimeConfig {
  yandexMaps: VueYandexMaps.PluginSettings;
}

export default defineNuxtModule<ModuleOptions>({
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
        // @ts-ignore
        app: {},
        // @ts-ignore
        public: {},
      };
    }

    // @ts-ignore
    if (!nuxt.options.runtimeConfig.public) nuxt.options.runtimeConfig.public = {};

    nuxt.options.runtimeConfig.public.yandexMaps = options;

    if (!nuxt.options.build.transpile) nuxt.options.build.transpile = [];
    nuxt.options.build.transpile.push('vue-yandex-maps');

    nuxt.hook('prepare:types', ({ tsConfig }) => {
      let typeRoots = tsConfig.compilerOptions!.typeRoots as string[] | undefined;
      if (!typeRoots) {
        tsConfig.compilerOptions!.typeRoots = [];
        typeRoots = tsConfig.compilerOptions!.typeRoots;
      }

      const path = relative(nuxt.options.buildDir, nuxt.options.rootDir);

      typeRoots!.push(join(path, 'node_modules/@types'));
      typeRoots!.push(join(path, 'node_modules/@yandex/ymaps3-types'));
    });

    addPlugin({
      src: createResolver(import.meta.url)
        .resolve('./runtime/plugin'),
    });
  },
});
