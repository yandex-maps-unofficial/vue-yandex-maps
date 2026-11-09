import type { App } from 'vue';
import type { YandexMapPluginSettings } from '#core';
import { initYmaps } from '#core';
import { createYmapsOptions } from '#core';

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
