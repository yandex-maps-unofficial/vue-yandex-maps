import { watch } from 'vue';
import { VueYandexMaps } from '../namespace.ts';
import YandexMapException = VueYandexMaps.YandexMapException;
import { throwException } from './utils/system.ts';

const allowedOptionsKeys: Record<keyof VueYandexMaps.PluginSettings, true> = {
  apikey: true,
  lang: true,
  initializeOn: true,
  importModules: true,
  version: true,
  strictMode: true,
  domain: true,
  mapsRenderWaitDuration: true,
  mapsScriptWaitDuration: true,
};

export function initYmaps() {
  return new Promise<void>((res, rej) => {
    if (typeof ymaps3 !== 'undefined') return res();
    if (typeof window === 'undefined') return rej(new YandexMapException('You must call initYmaps on Client Side only'));

    if (document.getElementById('vue-yandex-maps')) {
      const watcher = watch(VueYandexMaps.loadStatus, (val) => {
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

    const yandexMapScript = document.createElement('SCRIPT');
    const url = new URL(`${settings.domain}/${settings.version}/`);
    url.searchParams.set('lang', settings.lang || 'ru_RU');
    url.searchParams.set('apikey', settings.apikey);

    yandexMapScript.setAttribute('src', url.toString());
    yandexMapScript.setAttribute('async', '');
    yandexMapScript.setAttribute('defer', '');
    yandexMapScript.setAttribute('type', 'text/javascript');
    yandexMapScript.setAttribute('id', 'vue-yandex-maps');
    document.head.appendChild(yandexMapScript);
    yandexMapScript.onload = async () => {
      try {
        await VueYandexMaps.ymaps().ready;

        // @ts-expect-error
        ymaps3.getDefaultConfig().setApikeys({ router: 'test123' });

        // @ts-ignore Yandex forgot to specify strictMode in types
        if (settings.strictMode) VueYandexMaps.ymaps().strictMode = true;

        if (settings.importModules) {
          await Promise.all(
            settings.importModules.map(
              (module) => VueYandexMaps.ymaps()
                .import(module as any),
            ),
          );
        }

        VueYandexMaps.loadStatus.value = 'loaded';
        res();
      } catch (e) {
        VueYandexMaps.loadStatus.value = 'error';
        VueYandexMaps.loadError.value = e as Error;
        rej(e);
      }
    };
    yandexMapScript.onerror = (e) => {
      VueYandexMaps.loadError.value = e;
      rej(e);
    };
  });
}

export function createYmapsOptions(options: VueYandexMaps.PluginSettings): VueYandexMaps.PluginSettings {
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
    ...options,
  };
  if (!optionsShallowClone.apikey) {
    throwException({
      text: 'You must specify apikey for createYmapsOptions',
    });
  }

  const notAllowedKeys = Object.keys(optionsShallowClone)
    .filter((key) => !(key in allowedOptionsKeys));
  if (notAllowedKeys.length) {
    throwException({
      text: `You have passed unknown keys to createYmapsOptions: ${notAllowedKeys.join(', ')}. Only ${Object.keys(allowedOptionsKeys)
        .join(', ')} are allowed.`,
    });
  }

  VueYandexMaps.settings.value = optionsShallowClone;

  return optionsShallowClone;
}
