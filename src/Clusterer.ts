import { defineComponent, inject, onMounted, onBeforeUnmount, provide } from 'vue';
import useGeoObjectActions from './use/actions';
import { UpdateFunction } from './types';

export default defineComponent({
  name: 'YandexClusterer',
  props: {
    options: {
      type: Object as () => ymaps.IClustererOptions,
      default: () => ({}),
    },
  },
  emits: ['geo-objects-updated'],
  setup(props, { emit, expose, slots }) {
    const clusterer = new ymaps.Clusterer(props.options);
    const { addGeoObject, deleteGeoObject } = inject('geoObjectActions') || {};

    const updateGeoObjects: UpdateFunction<ymaps.GeoObject> = (arr, action) => {
      if (!clusterer || !arr.length) return;

      clusterer[action](arr);
      emit('geo-objects-updated', clusterer);

      arr = [];
    };

    const { addGeoObject: add, deleteGeoObject: remove } = useGeoObjectActions(updateGeoObjects);
    provide('geoObjectActions', { addGeoObject: add, deleteGeoObject: remove });

    onMounted(() => {
      addGeoObject(clusterer);
    });

    onBeforeUnmount(() => {
      deleteGeoObject(clusterer);
    });

    expose(clusterer);

    return () => slots.default?.();
  },
});
