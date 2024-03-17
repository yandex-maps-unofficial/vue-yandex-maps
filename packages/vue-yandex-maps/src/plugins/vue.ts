import type { App } from 'vue';
import { initYmaps } from '..';
import type { VueYandexMaps } from '..';
import { createYmapsOptions } from '../functions';

export function createYmaps(settings: VueYandexMaps.PluginSettings) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    install(app: App) {
      createYmapsOptions(settings);
      if (settings.initializeOn === 'onPluginInit') {
        initYmaps().catch(console.error);
      }
    },
  };
}

export function createYmapsVue2(settings: VueYandexMaps.PluginSettings) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    install(Vue: unknown) {
      createYmapsOptions(settings);
      if (settings.initializeOn === 'onPluginInit') {
        initYmaps().catch(console.error);
      }
    },
  };
}
