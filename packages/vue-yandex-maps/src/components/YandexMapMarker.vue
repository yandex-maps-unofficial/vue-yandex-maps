<script lang="ts">
import type { YMapMarker } from '@yandex/ymaps3-types';
import {
  computed, defineComponent, h, onMounted, ref, watch,
} from 'vue';
import type { PropType, SlotsType } from 'vue';
import { throwException } from '../composables/utils/system.ts';
import { setupMapChildren } from '../composables/utils/setupMapChildren.ts';
import { getMarkerContainerProps } from '../composables/utils/marker.ts';

import type { YandexMapMarkerPosition } from '../types/marker.ts';

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
     * If you want to make aligment to be like Yandex Maps 2.0, set this property to "top left-center".
     * @default default (as goes in Yandex by default)
     */
    position: {
      type: String as PropType<YandexMapMarkerPosition>,
    },
    /**
     * @description Allows you to add any attributes to <div class="__ymap-marker"> container.
     *
     * Important: to pass styles, you must use object-style prop instead of string.
     */
    containerAttrs: {
      type: Object,
      default: () => ({}),
    },
    /**
     * @description Allows you to add any attributes to <div class="__ymap-marker_wrapper"> container.
     *
     * Important: to pass styles, you must use object-style prop instead of string.
     */
    wrapperAttrs: {
      type: Object,
      default: () => ({}),
    },
    /**
     * @description Will add width and height: 0 to container.
     *
     * Null enables default behavior, false disables it completely (even if position is specified).
     *
     * @default true if position is specified, false otherwise
     */
    zeroSizes: {
      type: Boolean as PropType<boolean | null>,
      default: null,
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
  slots: Object as SlotsType<{
    default: {},
  }>,
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

    const rootProps = computed(() => getMarkerContainerProps({
      position: props.position,
      containerAttrs: props.containerAttrs,
      wrapperAttrs: props.wrapperAttrs,
      zeroSizes: props.zeroSizes,
    }));

    return () => h('div', {
      ...rootProps.value.root,
      ref: element,
    }, [
      h('div', {
        ...rootProps.value.children,
      }, slots.default?.({})),
    ]);
  },
});
</script>
