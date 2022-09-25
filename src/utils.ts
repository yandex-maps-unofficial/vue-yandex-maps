import { MapSettings, RecursiveArray, MarkerAction } from './types';
import type { InjectionKey } from 'vue';

export const actionsKey = Symbol() as InjectionKey<{ [key: string]: MarkerAction }>;
class EventEmitter {
  events: {
    [Key: string]: (() => void)[];
  };
  ymapReady: boolean;
  scriptIsNotAttached: boolean;
  pluginInstalledGlobal: boolean;

  constructor() {
    this.events = {};
    this.ymapReady = false;
    this.scriptIsNotAttached = true;
    this.pluginInstalledGlobal = false;
  }

  $on(eventName: string, fn: (value?: unknown) => void) {
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
  const readyCallback = (res: (value?: unknown) => void) => () => {
    ymaps.ready(() => {
      emitter.ymapReady = true;
      emitter.$emit('scriptIsLoaded');
      res(true);
    });
  };

  return new Promise((res, rej) => {
    if (window.ymaps) return res(true);

    if (document.getElementById('vue-yandex-maps-script')) {
      emitter.$on('scriptIsLoaded', res);
      return;
    }

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
    yandexMapScript.setAttribute('id', 'vue-yandex-maps-script');
    document.head.appendChild(yandexMapScript);
    emitter.scriptIsNotAttached = false;

    yandexMapScript.onload = readyCallback(res);
    yandexMapScript.onerror = rej;
  });
}

export const convertToNumbers = (item: any): RecursiveArray | number => {
  if (Array.isArray(item)) {
    return item.map(convertToNumbers);
  }

  return +item;
};

export const defaultMapEvents = [
  'actionend',
  'balloonclose',
  'balloonopen',
  'click',
  'contextmenu',
  'dblclick',
  'destroy',
  'hintclose',
  'hintopen',
  'optionschange',
  'sizechange',
  'typechange',
];
