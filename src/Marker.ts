import { defineComponent, onMounted, inject, PropType, onBeforeUnmount, computed } from 'vue';
import { MarkerType, Marker, RecursiveArray } from './types';
import { convertToNumbers } from './utils';

export default defineComponent({
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
      type: Object,
      default: () => ({}),
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
    const { addMarker, deleteMarker } = inject('markerActions') || {};
    const coordinates = computed(() => props.coords.map(convertToNumbers));

    const markerContent: Marker = {
      geometry: {
        type: props.type,
        coordinates: coordinates.value,
        radius: props.radius,
      },
      properties: props.properties,
    };
    const marker = new ymaps.GeoObject(markerContent);

    onMounted(() => {
      addMarker(marker);
    });

    onBeforeUnmount(() => {
      deleteMarker(marker);
    });

    return () => slots.default?.();
  },
});
