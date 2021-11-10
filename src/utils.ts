import { MapSettings } from './types';

declare global {
  interface Window {
    ymaps: any;
  }
}

class EventEmitter {
  events: {
    [Key: string]: (() => void)[];
  };
  ymapReady: boolean;
  scriptIsNotAttached: boolean;

  constructor() {
    this.events = {};
    this.ymapReady = false;
    this.scriptIsNotAttached = true;
  }

  $on(eventName: string, fn: () => void) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(fn);

    return () => {
      this.events[eventName] = this.events[eventName].filter((eventFn) => fn !== eventFn);
    };
  }

  $emit(eventName: string) {
    const event = this.events[eventName];
    if (event) {
      event.forEach((fn) => fn());
    }
  }
}

export const emitter = new EventEmitter();

export function ymapLoader(settings: MapSettings) {
  return new Promise((res, rej) => {
    if (window.ymaps) return res(true);

    const yandexMapScript = document.createElement('SCRIPT');
    const {
      apiKey = '',
      lang = 'ru_RU',
      version = '2.1',
      coordorder = 'latlong',
      debug = false,
      enterprise = false,
    } = settings;
    const mode = debug ? 'debug' : 'release';
    const settingsPart = `lang=${lang}${apiKey && `&apikey=${apiKey}`}&mode=${mode}&coordorder=${coordorder}`;
    const link = `https://${enterprise ? 'enterprise.' : ''}api-maps.yandex.ru/${version}/?${settingsPart}`;
    yandexMapScript.setAttribute('src', link);
    yandexMapScript.setAttribute('async', '');
    yandexMapScript.setAttribute('defer', '');
    yandexMapScript.setAttribute('id', 'vue-yandex-maps');
    document.head.appendChild(yandexMapScript);
    emitter.scriptIsNotAttached = false;
    yandexMapScript.onload = () => {
      window.ymaps.ready(() => {
        emitter.ymapReady = true;
        emitter.$emit('scriptIsLoaded');
        res(true);
      });
    };
    yandexMapScript.onerror = rej;
  });
}
