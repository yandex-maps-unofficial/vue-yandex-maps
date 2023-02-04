import { defineComponent, inject, onMounted, onBeforeUnmount, provide } from 'vue';
import useGeoObjectActions from './use/actions';
import { UpdateFunction } from './types';
import { actionsKey } from './utils';

export default defineComponent({
  name: 'YandexGeoObjectCollection',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['geo-objects-updated'],
  setup(props, { emit, expose, slots }) {
    const collection = new ymaps.GeoObjectCollection({}, props.options);
    const { addGeoObject, deleteGeoObject } = inject(actionsKey) || {};

    const updateGeoObjects: UpdateFunction<ymaps.GeoObject> = (arr, action) => {
      if (!collection || !arr.length) return;

      arr.forEach((geoObject) => collection[action](geoObject));
      emit('geo-objects-updated', collection);

      arr = [];
    };

    const { addGeoObject: add, deleteGeoObject: remove } = useGeoObjectActions(updateGeoObjects);
    provide(actionsKey, { addGeoObject: add, deleteGeoObject: remove });

    onMounted(() => {
      addGeoObject(collection);
    });

    onBeforeUnmount(() => {
      deleteGeoObject(collection);
    });

    expose(collection);

    return () => slots.default?.();
  },
});
