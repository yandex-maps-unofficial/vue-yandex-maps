import { defineComponent, inject, onMounted, onBeforeUnmount, provide } from 'vue';
import useGeoObjectActions from './use/marker-actions';

export default defineComponent({
  name: 'YandexClusterer',
  props: {
    options: Object as () => ymaps.IClustererOptions,
  },
  setup(props, { slots, emit }) {
    const clusterer = new ymaps.Clusterer(props.options);
    const { addGeoObject, deleteGeoObject } = inject('geoObjectActions') || {};

    const updateGeoObjects = (arr: ymaps.GeoObject[], action: 'add' | 'remove') => {
      if (!clusterer || !arr.length) return;

      clusterer[action](arr);
      emit('geoObjectsUpdated', clusterer);

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

    return () => slots.default?.();
  },
});
