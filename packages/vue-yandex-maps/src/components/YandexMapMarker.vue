<script lang="ts">
import type { YMapMarker } from '@yandex/ymaps3-types';
import type { PropType, CSSProperties } from 'vue';
import {
  computed, defineComponent, h, onMounted, ref, watch,
} from 'vue';
import { setupMapChildren, throwException } from '../composables/utils';
import type { YMapControlsProps } from '@yandex/ymaps3-types/imperative/YMapControls';

export type YandexMapMarkerPosition =
    YMapControlsProps['position']
    | 'default'
    | `translate${string}`

export default defineComponent({
  name: 'YandexMapMarker',
  props: {
    value: {
      type: Object as PropType<YMapMarker>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapMarker>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapMarker>[0]>,
      required: true,
    },
    /**
     * @description Sets translate(%, %) to marker to align it properly.
     *
     * If you want to make aligment to be like Yandex Maps 2.0, set this property to "top left".
     * @default default (as goes in Yandex by default)
     */
    position: {
      type: String as PropType<YandexMapMarkerPosition>,
    },
  },
  emits: {
    'input'(item: YMapMarker): boolean {
      return true;
    },
    'update:modelValue'(item: YMapMarker): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapMarker | undefined;

    const element = ref<null | HTMLDivElement>(null);

    onMounted(async () => {
      if (!props.settings.coordinates) {
        throwException({
          text: 'You must specify coordinates in YandexMapMarker settings',
        });
      }

      mapChildren = await setupMapChildren({
        settings: computed(() => props.settings),
        createFunction: () => new ymaps3.YMapMarker(props.settings, element.value!),
      });
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    watch(element, () => {
      if (element.value) element.value.parentNode?.removeChild(element.value);
    });

    const possiblePositions: Record<YandexMapMarkerPosition, `${`${number}%` | 0}, ${`${number}%` | 0}`> = {
      default: '0, 0',

      top: '0, -100%',
      bottom: '0, 100%',
      left: '-50%, 0',
      right: '50%, 0',

      'top left': '-50%, -100%',
      'top right': '50%, -100%',
      'bottom left': '-50%, 100%',
      'bottom right': '50%, 100%',

      'left top': '-50%, -100%',
      'left bottom': '-50%, 100%',
      'right top': '50%, -100%',
      'right bottom': '50%, 100%',
    };

    const rootStyles = computed<CSSProperties>(() => {
      const styles: CSSProperties = {};

      if (props.position && props.position !== 'default') {
        if (props.position in possiblePositions) styles.transform = `translate(${possiblePositions[props.position ?? 'default']})`;
        else if (props.position.startsWith('translate')) styles.transform = props.position;
      }

      return styles;
    });

    return () => h('div', {
      ref: element,
      style: rootStyles.value,
    }, slots.default?.());
  },
});
</script>
