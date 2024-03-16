import { createYmapsOptions, VueYandexMaps, initYmaps } from 'vue-yandex-maps';

const vueYandexMapsPlugin = async (context) => {
  createYmapsOptions(<%= JSON.stringify(options, null, 2) %>);
  if(process.client && VueYandexMaps.settings.value.initializeOn === 'onPluginInit') {
    initYmaps().catch(console.error);
  }
}

export default vueYandexMapsPlugin;
