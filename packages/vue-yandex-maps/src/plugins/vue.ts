import type { App } from 'vue';
import type { VueYandexMaps } from '..';
import { initYmaps } from '..';
import { createYmapsOptions } from '../functions';

export function createYmaps(settings: VueYandexMaps.PluginSettings) {
    return {

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

        install(Vue: unknown) {
            createYmapsOptions(settings);
            if (settings.initializeOn === 'onPluginInit') {
                initYmaps().catch(console.error);
            }
        },
    };
}
