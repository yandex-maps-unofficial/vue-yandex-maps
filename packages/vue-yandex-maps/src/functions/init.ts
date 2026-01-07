import { watch } from 'vue';
import { VueYandexMaps } from '../namespace.ts';
import { throwException } from '../utils/system.ts';
import YandexMapException = VueYandexMaps.YandexMapException;
import type DefaultUiTheme from '@yandex/ymaps3-default-ui-theme';
import type ContextMenu from '@yandex/ymaps3-context-menu';
import type DrawerControl from '@yandex/ymaps3-drawer-control';
import type Minimap from '@yandex/ymaps3-minimap';
import type * as WorldUtils from '@yandex/ymaps3-world-utils';
import type Resizer from '@yandex/ymaps3-resizer';
import type Signpost from '@yandex/ymaps3-signpost';
import type Spinner from '@yandex/ymaps3-spinner';
import type WebMercator from '@yandex/ymaps3-web-mercator-projection';
import type Cartesian from '@yandex/ymaps3-cartesian-projection';
import type Hint from '@yandex/ymaps3-hint';
import type Clusterer from '@yandex/ymaps3-clusterer';

const allowedOptionsKeys: Record<keyof VueYandexMaps.PluginSettings, true> = {
    apikey: true,
    servicesApikeys: true,
    lang: true,
    initializeOn: true,
    importModules: true,
    version: true,
    strictMode: true,
    domain: true,
    mapsRenderWaitDuration: true,
    mapsScriptWaitDuration: true,
    scriptAttributes: true,
    cdnLibraryLoading: true,
};

export function initYmaps() {
    return new Promise<void>((res, rej) => {
        if (typeof ymaps3 !== 'undefined') {
            if (VueYandexMaps.loadStatus.value !== 'loaded') VueYandexMaps.loadStatus.value = 'loaded';
            return res();
        }
        if (typeof window === 'undefined') return rej(new YandexMapException('You must call initYmaps on Client Side only'));

        if (VueYandexMaps.loadStatus.value === 'loading') {
            const watcher = watch(VueYandexMaps.loadStatus, val => {
                if (!VueYandexMaps.isLoaded.value) return;

                // Stopping watcher
                watcher();

                if (val === 'error') rej(VueYandexMaps.loadError);
                if (val === 'loaded') res();
            }, {
                immediate: true,
            });
            return;
        }

        VueYandexMaps.loadStatus.value = 'loading';

        const settings = VueYandexMaps.settings.value;
        if (!settings.apikey) {
            throwException({
                text: 'apikey was not set for Yandex Maps initialization. Ensure you have attached needed plugins or called createYmapsOptions with apikey. If you need delayed init, please use VueYandexMaps.isReadyToInit computed as v-if.',
            });
        }

        const yandexMapScript = document.createElement('SCRIPT');
        VueYandexMaps.script.value = yandexMapScript;
        const url = new URL(`${ settings.domain }/${ settings.version }/`);
        url.searchParams.set('lang', settings.lang || 'ru_RU');
        url.searchParams.set('apikey', settings.apikey);

        const scriptAttributes: Record<string, string | false> = {
            async: '',
            defer: '',
            referrerpolicy: 'strict-origin-when-cross-origin',
            type: 'text/javascript',
            id: 'vue-yandex-maps',
            src: url.toString(),
            ...(settings.scriptAttributes || {}),
        };

        for (const key in scriptAttributes) {
            if (scriptAttributes[key] === false) continue;
            yandexMapScript.setAttribute(key, scriptAttributes[key]);
        }

        document.head.appendChild(yandexMapScript);
        yandexMapScript.onload = async () => {
            try {
                await VueYandexMaps.ymaps().ready;

                if (settings.servicesApikeys && Object.keys(settings.servicesApikeys).length > 0) {
                    VueYandexMaps.ymaps()
                        .getDefaultConfig()
                        .setApikeys(settings.servicesApikeys);
                }
                if (typeof settings.strictMode === 'boolean') VueYandexMaps.ymaps().strictMode = settings.strictMode;

                if (settings.importModules) {
                    await Promise.all(
                        settings.importModules.map(
                            module => VueYandexMaps.ymaps()
                                .import(module as any),
                        ),
                    );
                }

                if (settings.cdnLibraryLoading?.enabled !== false) {
                    VueYandexMaps.ymaps().import.registerCdn(settings.cdnLibraryLoading?.url || 'https://cdn.jsdelivr.net/npm/{package}', [
                        ...[
                            '@yandex/ymaps3-default-ui-theme@latest',
                            '@yandex/ymaps3-resizer@latest',
                            '@yandex/ymaps3-minimap@latest',
                            '@yandex/ymaps3-context-menu@latest',
                            '@yandex/ymaps3-drawer-control@latest',
                            '@yandex/ymaps3-signpost@latest',
                            '@yandex/ymaps3-spinner@latest',
                            '@yandex/ymaps3-world-utils@latest',
                            '@yandex/ymaps3-web-mercator-projection@latest',
                            '@yandex/ymaps3-cartesian-projection@latest',
                            '@yandex/ymaps3-hint@latest',
                            '@yandex/ymaps3-clusterer@latest',
                        ].filter(x => !(settings.cdnLibraryLoading?.extendLibraries ?? []).some(y => {
                            if (!y.startsWith('@yandex')) return false;
                            return y.split('@')[1] === x.split('@')[1];
                        })),
                        ...settings.cdnLibraryLoading?.extendLibraries ?? [],
                    ]);
                }

                VueYandexMaps.loadStatus.value = 'loaded';
                res();
            }
            catch (e) {
                VueYandexMaps.loadStatus.value = 'error';
                VueYandexMaps.loadError.value = e as Error;
                rej(e);
            }
        };
        yandexMapScript.onerror = e => {
            VueYandexMaps.loadError.value = e;
            rej(e);
        };
    });
}

export function createYmapsOptions(options: VueYandexMaps.PluginSettings, ignoreNoCurrentInstance = false): VueYandexMaps.PluginSettings {
    // Only init once
    if (VueYandexMaps.isReadyToInit.value) return VueYandexMaps.settings.value;

    // Using DefProductSettings to ensure all non-required fields will always have default value
    const optionsShallowClone: VueYandexMaps.DefProductSettings = {
        lang: 'ru_RU',
        initializeOn: 'onComponentMount',
        importModules: [],
        version: 'v3',
        strictMode: false,
        domain: 'https://api-maps.yandex.ru',
        mapsRenderWaitDuration: true,
        mapsScriptWaitDuration: true,
        servicesApikeys: null,
        scriptAttributes: {},
        cdnLibraryLoading: {},
        ...options,
    };
    if (!optionsShallowClone.apikey) {
        throwException({
            text: 'You must specify apikey for createYmapsOptions',
        });
    }

    const notAllowedKeys = Object.keys(optionsShallowClone)
        .filter(key => !(key in allowedOptionsKeys));
    if (notAllowedKeys.length) {
        throwException({
            text: `You have passed unknown keys to createYmapsOptions: ${ notAllowedKeys.join(', ') }. Only ${ Object.keys(allowedOptionsKeys)
                .join(', ') } are allowed.`,
        });
    }

    // Don't modify ref on SSR
    if (typeof window === 'undefined') return optionsShallowClone;

    VueYandexMaps.settings.value = optionsShallowClone;

    return optionsShallowClone;
}

interface CDNModules {
    '@yandex/ymaps3-default-ui-theme': typeof DefaultUiTheme;
    '@yandex/ymaps3-context-menu': typeof ContextMenu;
    '@yandex/ymaps3-drawer-control': typeof DrawerControl;
    '@yandex/ymaps3-spinner': typeof Spinner;
    '@yandex/ymaps3-minimap': typeof Minimap;
    '@yandex/ymaps3-signpost': typeof Signpost;
    '@yandex/ymaps3-resizer': typeof Resizer;
    '@yandex/ymaps3-world-utils': typeof WorldUtils;
    '@yandex/ymaps3-web-mercator-projection': typeof WebMercator;
    '@yandex/ymaps3-cartesian-projection': typeof Cartesian;
    '@yandex/ymaps3-clusterer': typeof Clusterer;
    '@yandex/ymaps3-hint': typeof Hint;
}

export function importYmapsCDNModule<T extends keyof CDNModules>(module: T): Promise<CDNModules[T]> {
    return ymaps3.import(module as any) as any;
}
