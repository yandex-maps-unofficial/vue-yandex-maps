import ymapsNamespace from 'yandex-maps';
import { MapSettings } from './types';
import Map from './Map';
import Marker from './Marker';
import Collection from './Collection';
import Clusterer from './Clusterer';

declare global {
  const ymaps: typeof ymapsNamespace;

  interface Window {
    ymaps: typeof ymapsNamespace;
  }
}

let isPluginInstalled: boolean;

export default {
  install: (app: any, options: MapSettings) => {
    if (isPluginInstalled) return;
    isPluginInstalled = true;
    app.provide('pluginOptions', options);
    app.component('yandex-map', Map);
    app.component('yandex-marker', Marker);
    app.component('yandex-collection', Collection);
    app.component('yandex-clusterer', Clusterer);
  },
};
