import { defineComponent, onMounted, inject, PropType, onBeforeUnmount, computed } from 'vue';
import { MarkerType, MarkerFeature, RecursiveArray } from './types';
import { convertToNumbers } from './utils';

export default defineComponent({
  name: 'YandexMarker',
  props: {
    coords: {
      type: Array as () => Array<RecursiveArray | number>,
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
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const { addGeoObject, deleteGeoObject } = inject('geoObjectActions') || {};
    const coordinates = computed(() => props.coords.map(convertToNumbers));

    const feature: MarkerFeature = {
      geometry: {
        type: props.type,
        coordinates: coordinates.value,
        radius: props.radius,
      },
      properties: props.properties,
    };
    const marker = new ymaps.GeoObject(feature, props.options);

    onMounted(() => {
      addGeoObject(marker);
    });

    onBeforeUnmount(() => {
      deleteGeoObject(marker);
    });

    return () => slots.default?.();
  },
});
