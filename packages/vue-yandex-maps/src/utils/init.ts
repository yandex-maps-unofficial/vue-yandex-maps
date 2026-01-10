import { shallowRef } from 'vue';
import type { Ref } from 'vue';
import type { OverloadParameters } from '../types/overload-extract.ts';
import { safeComputed, safeRef } from './system.ts';
import type { Apikeys } from '@yandex/ymaps3-types/imperative/config';
import type { YMapEntity } from '@yandex/ymaps3-types';

export interface IYandexMapTrafficLayerProps {
    visible: boolean;
    [key: string]: any;
}

export declare class IYandexMapTrafficLayer extends YMapEntity<IYandexMapTrafficLayerProps> {

}

export interface IYandexMapTrafficEventsLayerProps extends IYandexMapTrafficLayerProps {}

export declare class IYandexMapTrafficEventsLayer extends YMapEntity<IYandexMapTrafficEventsLayerProps> {

}

export const yandexMapSettings: Ref<YandexMapPluginSettings> = safeRef({
    apikey: '',
});

/**
     * @description True when `createYmapsOptions` was called and settings were set
     * @note Useful if there's a change your map may be initialized earlier than you will set settings
     */
export const isYandexMapReadyToInit = safeComputed(() => !!yandexMapSettings.value.apikey);

// Type-safe ymaps3 to avoid "never" problems with undefined checks
export const yandexMapYmaps3 = () => ymaps3;
export const yandexMapScript = shallowRef<HTMLElement | null>(null);

export class YandexMapException extends Error {
    constructor(message: string) {
        super(message);
        this.message = message;
        this.name = 'YandexMapException';
    }
}

export type YandexMapLoadStatus = 'pending' | 'loading' | 'loaded' | 'error';

export const yandexMapLoadStatus = safeRef<YandexMapLoadStatus>('pending');
export const yandexMapIsLoaded = safeComputed(() => yandexMapLoadStatus.value === 'loaded' || yandexMapLoadStatus.value === 'error');
export const yandexMapLoadError = safeRef<null | Error | Parameters<OnErrorEventHandlerNonNull>[0]>(null);

export interface YandexMapLayersExtra {
    YMapTrafficLayer: typeof IYandexMapTrafficLayer;
    YMapTrafficEventsLayer: typeof IYandexMapTrafficEventsLayer;
}

/**
     * @description type-safe import for layers-extra module
     * @internal
     */
export function importLayersExtra() {
    // @ts-expect-error Missing module in types
    return ymaps3.import('@yandex/ymaps3-layers-extra') as Promise<YandexMapLayersExtra>;
}

export interface YandexMapPluginSettings {
    /**
         * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/load.html#parms
         * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/load.html#parms
         */
    apikey: string;
    /**
         * @description Allows to set apikeys for Yandex Services.
         *
         * @note You should only set those on first setup. Will have no effect afterward.
         * @example router for `ymaps3.route` and `suggest` for `ymaps3.suggest`
         */
    servicesApikeys?: Apikeys | null;
    /**
         * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/load.html#parms
         * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/load.html#parms
         * @default ru_RU
         */
    lang?: string;
    /**
         * @default v3
         */
    version?: string;
    /**
         * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/general.html#strict-mode
         * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/general.html#strict-mode
         * @default false
         */
    strictMode?: boolean;
    cdnLibraryLoading?: {
        /**
             * @default true
             */
        enabled?: boolean;
        /**
             * @default https://cdn.jsdelivr.net/npm/{package}
             */
        url?: string;
        /**
             * @description Libraries to add to CDN loading list
             */
        extendLibraries?: string[];
    };
    /**
         * @default https://api-maps.yandex.ru
         */
    domain?: string;
    /**
         * @description You can choose where to initialize Yandex Maps library
         *
         * - onPluginInit will load maps on `vue-yandex-maps` plugin init (Client Side only)
         * - onComponentMount will load maps as soon as you load component (lazy option, default)
         * - never will require you to call initYmaps by yourself
         *
         * @default onComponentMount
         */
    initializeOn?: 'onPluginInit' | 'onComponentMount' | 'never';
    /**
         * @description You can preload modules in initYmaps, note you will still have to import them later to use
         * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/ref/modules/index.html
         * @see https://yandex.com/dev/maps/jsapi/doc/3.0/ref/modules/index.html
         */
    importModules?: OverloadParameters<typeof ymaps3['import']>[0][];
    /**
         * @description Amount of time in milliseconds library will wait for Yandex script full load.
         *
         * Set this to false, to disable this behavior and make library wait forever.
         * @default true (5000)
         */
    mapsScriptWaitDuration?: number | boolean;
    /**
         * @description Amount of time in milliseconds library will wait for all components render after Yandex script was loaded.
         *
         * Set this to false, to disable this behavior and make library wait forever.
         * @note If you disable this behavior completely, any fatal error inside components will not lead to exception and library will never load.
         * @default true (5000)
         */
    mapsRenderWaitDuration?: number | boolean;
    /**
         * @description Sets script tag attributes
         * @default async defer referrerpolicy=strict-origin-when-cross-origin type=text/javascript
         * @note src will be ignored
         */
    scriptAttributes?: Record<Lowercase<string>, string | false>;
}

/**
     * @description Strict-typed version of PluginSettings with all keys required
     */
export type DefProductSettings = {
    [T in keyof YandexMapPluginSettings]-?: YandexMapPluginSettings[T]
};
