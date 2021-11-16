import { h, defineComponent, inject } from 'vue';
import * as utils from './utils';
import { MapSettings } from './types';

type MapType = 'map' | 'hybrid' | 'satellite';

export default defineComponent({
  name: 'YandexMap',
  props: {
    coords: {
      type: Array as () => number[],
      required: true,
    },
    zoom: {
      type: Number,
      default: 10,
    },
    bounds: {
      type: Array as () => number[][],
    },
    behaviors: {
      type: Array as () => string[],
    },
    controls: {
      type: Array as () => string[],
    },
    mapType: {
      type: String,
      default: 'map',
    },
    settings: {
      type: Object as () => MapSettings,
      default: () => ({}),
    },
    debug: Boolean,
  },
  setup(props, { slots }) {
    const pluginOptions: MapSettings = inject('pluginOptions') || {};
    let map = null;
    const ymapId = `yandexMap${Math.round(Math.random() * 100000)}`;

    const init = () => {
      map = new ymaps.Map(ymapId, {
        center: props.coords,
        zoom: props.zoom,
        bounds: props.bounds,
        behaviors: props.behaviors,
        controls: props.controls,
        type: `yandex#${props.mapType as MapType}`,
      });
    };

    if (utils.emitter.scriptIsNotAttached) {
      const settings = { ...pluginOptions, ...props.settings };
      utils.ymapLoader(settings);
    }
    if (utils.emitter.ymapReady) {
      ymaps.ready(init);
    } else {
      utils.emitter.$on('scriptIsLoaded', init);
    }

    return () =>
      h('section', { class: 'ymap-container' }, [
        h('div', { id: ymapId, style: 'min-height: 100%;' }),
        h('div', [slots.default?.()]),
      ]);
  },
});
