<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import {
  computed, defineComponent, h, onMounted, ref, watch,
} from 'vue';
import type { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';
import { throwException } from '../../../composables/utils/system.ts';
import { setupMapChildren } from '../../../composables/utils/setupMapChildren.ts';

export type YandexMapDefaultMarkerSettings = ConstructorParameters<typeof YMapDefaultMarker>[0]

export default defineComponent({
  name: 'YandexMapDefaultMarker',
  props: {
    value: {
      type: Object as PropType<YMapDefaultMarker>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapDefaultMarker>,
      default: null,
    },
    settings: {
      type: Object as PropType<YandexMapDefaultMarkerSettings>,
      required: true,
    },
  },
  emits: {
    'input'(item: YMapDefaultMarker): boolean {
      return true;
    },
    'update:modelValue'(item: YMapDefaultMarker): boolean {
      return true;
    },
  },
  slots: Object as SlotsType<{
    popup: {
      close: () => void,
    },
  }>,
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapDefaultMarker | undefined;
    const popup = ref<HTMLDivElement | null>(null);
    const closeFunc = ref<() => void>(() => {
    });

    const contentFunc = (close: () => void) => {
      closeFunc.value = close;
      return popup.value!;
    };

    const getSettings = computed<YandexMapDefaultMarkerSettings>(() => {
      const settings = { ...props.settings };

      if (settings.popup && (typeof settings.popup.content === 'undefined' || settings.popup.content === 'fromSlot') && popup.value) {
        settings.popup = {
          ...settings.popup,
          content: contentFunc,
        };
      }

      return settings;
    });

    onMounted(async () => {
      if (!props.settings.coordinates) {
        throwException({
          text: 'You must specify coordinates in YandexMapDefaultMarker settings',
        });
      }

      mapChildren = await setupMapChildren({
        createFunction: ({ YMapDefaultMarker: Marker }) => new Marker(getSettings.value),
        requiredImport: () => ymaps3.import('@yandex/ymaps3-markers@0.0.1'),
        settings: getSettings,
      });
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    watch(popup, () => {
      if (popup.value) popup.value.parentNode?.removeChild(popup.value);
    });

    return () => h('div', {
      ref: popup,
    }, slots.popup?.({ close: closeFunc.value }));
  },
});
</script>
