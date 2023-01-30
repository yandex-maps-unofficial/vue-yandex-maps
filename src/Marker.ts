import {
  defineComponent,
  onMounted,
  provide,
  inject,
  PropType,
  onBeforeUnmount,
  computed,
  h,
  ref,
  Teleport,
  watch,
} from 'vue';
import { MarkerType, MarkerFeature, RecursiveArray, MarkerGeometry } from './types';
import { convertToNumbers, actionsKey } from './utils';
import { DEFAULT_MARKER_EVENTS } from './constants';

export default defineComponent({
  name: 'YandexMarker',
  props: {
    coordinates: {
      type: Array as PropType<Array<RecursiveArray | number>>,
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
      type: Object as PropType<ymaps.IGeoObjectOptions>,
      default: null,
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
      type: Array as PropType<string[]>,
      default: () => ['click'],
      validator: (val: string[]) => val.every((event) => DEFAULT_MARKER_EVENTS.includes(event)),
    },
  },
  emits: [...DEFAULT_MARKER_EVENTS],
  setup(props, { emit, slots, expose }) {
    const { addGeoObject, deleteGeoObject } = inject(actionsKey) || {};
    const coords = computed(() => props.coordinates.map(convertToNumbers));
    const isBalloonOpen = ref(false);

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
    const balloonContentLayout: any = slots.component?.().length
      ? ymaps.templateLayoutFactory.createClass(`<div id="balloon-${props.markerId}" class="yandex-balloon"><div>`, {
          build() {
            balloonContentLayout.superclass.build.call(this);
            isBalloonOpen.value = true;
          },
          clear() {
            isBalloonOpen.value = false;
            balloonContentLayout.superclass.clear.call(this);
          },
        })
      : null;

    const options = {
      balloonContentLayout,
      ...props.options,
    };
    const marker = new ymaps.GeoObject(feature, options);
    props.events.forEach((event: any) => marker.events?.add(event, (e) => emit(event, e)));

    provide('marker', marker);

    const markerJson = {
      ...feature,
      options,
    };

    onMounted(() => {
      addGeoObject(marker, markerJson);
    });

    onBeforeUnmount(() => {
      deleteGeoObject(marker, markerJson);
    });

    watch(
      () => props.coordinates,
      (coordinates) => {
        (marker.geometry as MarkerGeometry)?.setCoordinates?.(coordinates);
      },
    );

    expose(marker);

    if (slots.component?.().length) {
      return () => isBalloonOpen.value && h(Teleport, { to: `#balloon-${props.markerId}` }, [slots.component?.()]);
    }
    return () => slots.default?.();
  },
});
