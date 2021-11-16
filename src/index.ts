import * as ymapsObj from 'yandex-maps';
import { MapSettings } from './types';
import Map from './Map';

declare global {
  const ymaps: typeof ymapsObj;
}

let isPluginInstalled: boolean;

export default {
  install: (app: any, options: MapSettings) => {
    if (isPluginInstalled) return;
    isPluginInstalled = true;
    app.provide('pluginOptions', options);
    app.component('yandex-map', Map);
  },
};
