import type { App } from 'vue';
import type { YandexMapPluginSettings } from '..';
import { initYmaps } from '..';
import { createYmapsOptions } from '../functions';

export function createYmaps(settings: YandexMapPluginSettings) {
    return {
        install(app: App) {
            createYmapsOptions(settings);
            if (settings.initializeOn === 'onPluginInit') {
                initYmaps().catch(console.error);
            }
        },
    };
}
