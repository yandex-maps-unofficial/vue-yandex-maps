import ymapsNamespace from 'yandex-maps';
import { MapSettings } from './types';
import { ymapLoader, emitter } from './utils';
import Map from './Map';
import Marker from './Marker';
import Collection from './Collection';
import Clusterer from './Clusterer';
import ObjectManager from './ObjectManager';

declare global {
  const ymaps: typeof ymapsNamespace;

  interface Window {
    ymaps: typeof ymapsNamespace;
  }
}

let isPluginInstalled: boolean;

export const loadYmap = ymapLoader;
export const YandexMap = Map;
export const YandexMarker = Marker;
export const YandexCollection = Collection;
export const YandexClusterer = Clusterer;
export const YandexObjectManager = ObjectManager;

export default {
  install: (app: any, options: MapSettings) => {
    if (isPluginInstalled) return;
    isPluginInstalled = true;
    emitter.pluginInstalledGlobal = true;

    app.provide('pluginOptions', options);
    app.component('YandexMap', Map);
    app.component('YandexMarker', Marker);
    app.component('YandexCollection', Collection);
    app.component('YandexClusterer', Clusterer);
    app.component('YandexObjectManager', ObjectManager);
  },
};
