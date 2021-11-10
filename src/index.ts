import { provide } from 'vue';
import { MapSettings } from './types';
import Map from './Map';

let isPluginInstalled: boolean;

export default {
  install: (app: any, options: MapSettings) => {
    if (isPluginInstalled) return;
    isPluginInstalled = true;
    provide('pluginOptions', options);
    app.component('yandex-map', Map);
  },
};
