import { h, defineComponent, inject, provide, ref } from 'vue';
import * as utils from './utils';
import { MapSettings, MarkerAction } from './types';

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
    const isReady = ref(false);
    const pluginOptions: MapSettings = inject('pluginOptions') || {};
    let map: ymaps.Map | undefined;
    const ymapId = `yandexMap${Math.round(Math.random() * 100000)}`;

    // Prepare marker actions to provide
    const markersToAdd: ymaps.GeoObject[] = [];
    const markersToDelete: ymaps.GeoObject[] = [];
    let addMarkerTimeout: number | undefined;
    let deleteMarkerTimeout: number | undefined;

    const addMarker: MarkerAction = (marker: ymaps.GeoObject) => {
      markersToAdd.push(marker);
      clearTimeout(addMarkerTimeout);
      addMarkerTimeout = window.setTimeout(() => updateMarkers(markersToAdd, 'add'));
    };

    const deleteMarker: MarkerAction = (marker: ymaps.GeoObject) => {
      markersToDelete.push(marker);
      clearTimeout(deleteMarkerTimeout);
      deleteMarkerTimeout = window.setTimeout(() => updateMarkers(markersToDelete, 'remove'));
    };

    const updateMarkers = (arr: ymaps.GeoObject[], action: 'add' | 'remove') => {
      if (!map || !arr.length) return;

      arr.reduce((geoObjects, marker) => geoObjects[action](marker), map.geoObjects);
      arr = [];
    };

    provide('markerActions', { addMarker, deleteMarker });

    // Map initialization
    const init = () => {
      isReady.value = true;
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
        isReady.value && h('div', [slots.default?.()]),
      ]);
  },
});
