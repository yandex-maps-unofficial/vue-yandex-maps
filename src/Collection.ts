import { defineComponent, inject, onMounted, onBeforeUnmount, provide } from 'vue';
import useGeoObjectActions from './use-marker-actions';

export default defineComponent({
  name: 'GeoObjectCollection',
  props: {
    feature: Object,
    properties: Object,
  },
  setup(props, { slots, emit }) {
    const collection = new ymaps.GeoObjectCollection(props.feature, props.properties);
    const { addGeoObject, deleteGeoObject } = inject('geoObjectActions') || {};

    const updateGeoObjects = (arr: ymaps.GeoObject[], action: 'add' | 'remove') => {
      if (!collection || !arr.length) return;

      arr.forEach((geoObject) => collection[action](geoObject));
      emit('geoObjectsUpdated', collection);

      arr = [];
    };

    const { addGeoObject: add, deleteGeoObject: remove } = useGeoObjectActions(updateGeoObjects);
    provide('geoObjectActions', { addGeoObject: add, deleteGeoObject: remove });

    onMounted(() => {
      addGeoObject(collection);
    });

    onBeforeUnmount(() => {
      deleteGeoObject(collection);
    });

    return () => slots.default?.();
  },
});
