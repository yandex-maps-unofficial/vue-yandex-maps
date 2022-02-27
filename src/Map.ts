import { h, defineComponent, provide, inject, ref } from 'vue';
import * as utils from './utils';
import { DEFAULT_MAP_EVENTS } from './constants';
import { MapSettings, MapType, DetailedControls, UpdateFunction } from './types';
import useGeoObjectActions from './use/actions';

export default defineComponent({
  name: 'YandexMap',
  props: {
    coordinates: {
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
    detailedControls: {
      type: Object as () => DetailedControls,
    },
    events: {
      type: Array as () => string[],
      default: () => ['click'],
      validator: (val: string[]) => val.every((event) => DEFAULT_MAP_EVENTS.includes(event)),
    },
    mapType: {
      type: String,
      default: 'map',
    },
    settings: {
      type: Object as () => MapSettings,
      default: () => ({}),
    },
  },
  emits: [...DEFAULT_MAP_EVENTS, 'geo-objects-updated', 'created'],
  setup(props, { emit, slots, expose }) {
    const isReady = ref(false);
    const pluginOptions: MapSettings | object = (utils.emitter.pluginInstalledGlobal && inject('pluginOptions')) || {};
    let map: ymaps.Map | undefined;
    const ymapId = `yandexMap${Math.round(Math.random() * 100000)}`;

    const updateGeoObjects: UpdateFunction<ymaps.GeoObject> = (arr, action) => {
      if (!map || !arr.length) return;

      arr.forEach((geoObject) => map?.geoObjects[action](geoObject));

      emit('geo-objects-updated', map.geoObjects);
      arr = [];
    };

    const { addGeoObject, deleteGeoObject } = useGeoObjectActions(updateGeoObjects);

    provide('geoObjectActions', { addGeoObject, deleteGeoObject });

    const init = () => {
      isReady.value = true;
      map = new ymaps.Map(ymapId, {
        center: props.coordinates,
        zoom: props.zoom,
        bounds: props.bounds,
        behaviors: props.behaviors,
        controls: props.controls,
        type: `yandex#${props.mapType}` as MapType,
      });

      props.events.forEach((event) => map?.events.add(event, (e) => emit(event, e)));

      if (props.detailedControls) {
        const controls = Object.keys(props.detailedControls) as ymaps.ControlKey[];
        controls.forEach((controlName) => {
          map?.controls.remove(controlName);
          map?.controls.add(controlName, props.detailedControls?.[controlName]);
        });
      }

      emit('created', map);
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

    expose(map);

    return h('section', { class: 'yandex-container' }, [
      h('div', { id: ymapId, style: 'min-height: 100%;' }),
      isReady.value && h('div', { style: 'display: none;' }, [slots.default?.()]),
    ]);
  },
});
