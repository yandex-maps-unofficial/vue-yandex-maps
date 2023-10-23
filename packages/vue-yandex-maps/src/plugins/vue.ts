import type { App } from 'vue';
import { VueYandexMaps } from '..';
import { createYmapsOptions } from '../composables/maps';

export function createYmaps(settings: VueYandexMaps.PluginSettings) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    install(app: App) {
      createYmapsOptions(settings);
    },
  };
}

export function createYmapsVue2(settings: VueYandexMaps.PluginSettings) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    install(Vue: unknown) {
      createYmapsOptions(settings);
    },
  };
}
