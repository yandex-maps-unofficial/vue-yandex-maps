import { defineComponent, inject, onMounted, onBeforeUnmount, provide, PropType } from 'vue';
import useGeoObjectActions from './use/actions';
import { UpdateFunction, MarkerJson } from './types';
import { actionsKey } from './utils';

export default defineComponent({
  name: 'YandexObjectManager',
  props: {
    options: {
      type: Object as PropType<ymaps.IObjectManagerOptions>,
      default: () => ({}),
    },
  },
  emits: ['geo-objects-updated'],
  setup(props, { emit, expose, slots }) {
    const objectManager = new ymaps.ObjectManager(props.options);
    const { addGeoObject, deleteGeoObject } = inject(actionsKey) || {};

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
    provide(actionsKey, { addGeoObject: add, deleteGeoObject: remove });

    onMounted(() => {
      addGeoObject(objectManager);
    });

    onBeforeUnmount(() => {
      deleteGeoObject(objectManager);
    });

    expose(objectManager);

    return () => slots.default?.();
  },
});
