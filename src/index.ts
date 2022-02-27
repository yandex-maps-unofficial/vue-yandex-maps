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
export const yandexMap = Map;
export const yandexMarker = Marker;
export const yandexCollection = Collection;
export const yandexClusterer = Clusterer;
export const yandexObjectManager = ObjectManager;

export default {
  install: (app: any, options: MapSettings) => {
    if (isPluginInstalled) return;
    isPluginInstalled = true;
    emitter.pluginInstalledGlobal = true;

    app.provide('pluginOptions', options);
    app.component('yandex-map', Map);
    app.component('yandex-marker', Marker);
    app.component('yandex-collection', Collection);
    app.component('yandex-clusterer', Clusterer);
    app.component('yandex-object-manager', ObjectManager);
  },
};
