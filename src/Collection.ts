import { defineComponent, inject, onMounted, onBeforeUnmount, provide } from 'vue';
import useGeoObjectActions from './use/actions';
import { UpdateFunction } from './types';

export default defineComponent({
  name: 'YandexGeoObjectCollection',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['geo-objects-updated'],
  setup(props, { emit }) {
    const collection = new ymaps.GeoObjectCollection({}, props.options);
    const { addGeoObject, deleteGeoObject } = inject('geoObjectActions') || {};

    const updateGeoObjects: UpdateFunction<ymaps.GeoObject> = (arr, action) => {
      if (!collection || !arr.length) return;

      arr.forEach((geoObject) => collection[action](geoObject));
      emit('geo-objects-updated', collection);

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

    return {
      collection,
    };
  },
  render() {
    return this.$slots.default?.();
  },
});
