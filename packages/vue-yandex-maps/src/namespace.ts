import type { Ref } from 'vue';
import type { OverloadParameters } from './types/overload-extract.ts';
import { safeComputed, safeRef } from './composables/utils/system.ts';

export namespace VueYandexMaps {
  export const settings: Ref<VueYandexMaps.PluginSettings> = safeRef({
    apikey: '',
  });

  // Type-safe ymaps3 to avoid "never" problems with undefined checks
  export const ymaps = () => ymaps3;

  export class YandexMapException extends Error {
    constructor(message: string) {
      super(message);
      this.message = message;
      this.name = 'YandexMapException';
    }
  }

  export type LoadStatus = 'pending' | 'loading' | 'loaded' | 'error'

  export const loadStatus = safeRef<LoadStatus>('pending');
  export const isLoaded = safeComputed(() => loadStatus.value === 'loaded' || loadStatus.value === 'error');
  export const loadError = safeRef<null | Error | Parameters<OnErrorEventHandlerNonNull>[0]>(null);

  export interface PluginSettings {
    /**
     * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/load.html#parms
     * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/load.html#parms
     */
    apikey: string;
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
    /**
     * @default https://api-maps.yandex.ru
     */
    domain?: string;
    /**
     * @description You can choose where to initialize Yandex Maps library
     *
     * - onPluginInit will load maps as soon as you call createYmapsOptions (on Client Side only)
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
     * Set this to false, to disable this behaviour and make library wait forever.
     * @default true (5000)
     */
    yandexMapsScriptWaitDuration?: number | boolean;
    /**
     * @description Amount of time in milliseconds library will wait for all components render after Yandex script was loaded.
     *
     * Set this to false, to disable this behaviour and make library wait forever.
     * @note If you disable this behaviour completely, any fatal error inside components will not lead to exception and library will never load.
     * @default true (5000)
     */
    mapsRenderWaitDuration?: number | boolean;
  }

  /**
   * @description Strict-typed version of PluginSettings with all keys required
   */
  export type DefProductSettings = {
    [T in keyof PluginSettings]-?: PluginSettings[T]
  }
}
