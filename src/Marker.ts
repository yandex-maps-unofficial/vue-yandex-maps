import { defineComponent, onMounted, inject, PropType, onBeforeUnmount, computed } from 'vue';
import { MarkerType, MarkerFeature, RecursiveArray } from './types';
import { convertToNumbers } from './utils';
import { DEFAULT_MARKER_EVENTS } from './constants';

export default defineComponent({
  name: 'YandexMarker',
  props: {
    coordinates: {
      type: Array as () => Array<RecursiveArray | number>,
      required: true,
    },
    markerId: {
      type: [String, Number],
      required: true,
    },
    properties: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object as () => ymaps.IGeoObjectOptions,
    },
    type: {
      type: String as PropType<MarkerType>,
      default: 'Point',
    },
    radius: {
      type: Number,
      default: null,
    },
    events: {
      type: Array as () => string[],
      default: () => ['click'],
      validator: (val: string[]) => val.every((event) => DEFAULT_MARKER_EVENTS.includes(event)),
    },
  },
  setup(props, { emit }) {
    const { addGeoObject, deleteGeoObject } = inject('geoObjectActions') || {};
    const coords = computed(() => props.coordinates.map(convertToNumbers));

    const feature: MarkerFeature = {
      geometry: {
        type: props.type,
        coordinates: coords.value,
        radius: props.radius,
      },
      properties: {
        ...props.properties,
        markerId: props.markerId,
      },
    };
    const marker = new ymaps.GeoObject(feature, props.options);
    props.events.forEach((event) => marker.events.add(event, (e) => emit(event, e)));

    const markerJson = {
      ...feature,
      options: props.options,
    };

    onMounted(() => {
      addGeoObject(marker, markerJson);
    });

    onBeforeUnmount(() => {
      deleteGeoObject(marker, markerJson);
    });

    return { marker };
  },
  render() {
    return this.$slots.default?.();
  },
});
