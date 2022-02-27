import { defineComponent, inject, onMounted, onBeforeUnmount, provide } from 'vue';
import useGeoObjectActions from './use/actions';
import { UpdateFunction, MarkerJson } from './types';

export default defineComponent({
  name: 'YandexObjectManager',
  props: {
    options: {
      type: Object as () => ymaps.IObjectManagerOptions,
      default: () => ({}),
    },
  },
  emits: ['geo-objects-updated'],
  setup(props, { emit, expose, slots }) {
    const objectManager = new ymaps.ObjectManager(props.options);
    const { addGeoObject, deleteGeoObject } = inject('geoObjectActions') || {};

    const updateGeoObjects: UpdateFunction<MarkerJson> = (arr, action) => {
      if (!objectManager || !arr.length) return;

      const featureArray = arr.map((item) => ({
        type: 'Feature',
        id: item.properties.markerId,
        geometry: item.geometry,
        properties: item.properties,
        options: item.options,
      }));

      objectManager[action](featureArray);
      emit('geo-objects-updated', objectManager);

      arr = [];
    };

    const { addGeoObject: add, deleteGeoObject: remove } = useGeoObjectActions(updateGeoObjects, true);
    provide('geoObjectActions', { addGeoObject: add, deleteGeoObject: remove });

    onMounted(() => {
      addGeoObject(objectManager);
    });

    onBeforeUnmount(() => {
      deleteGeoObject(objectManager);
    });

    expose(objectManager);

    return slots.default?.();
  },
});
