<script lang="ts">
import {
  computed, defineComponent, h, onMounted, PropType, ref,
} from 'vue';
import { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';
import { setupMapChildren } from '../composables/utils';

type Settings = ConstructorParameters<typeof YMapDefaultMarker>[0]

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
      type: Object as PropType<Settings>,
      default: () => ({}),
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
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapDefaultMarker | undefined;
    const popup = ref<HTMLDivElement | null>(null);
    const closeFunc = ref<() => void>(() => {
    });

    const getSettings = computed<Settings>(() => {
      const settings = { ...props.settings };

      if (settings.popup && (typeof settings.popup.content === 'undefined' || settings.popup.content === 'fromSlot') && popup.value) {
        settings.popup = {
          ...settings.popup,
          content: (close) => {
            closeFunc.value = close;
            return popup.value!;
          },
        };
      }

      return settings;
    });

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: ({ YMapDefaultMarker: Marker }) => new Marker(getSettings.value),
        requiredImport: () => ymaps3.import('@yandex/ymaps3-markers@0.0.1'),
        settings: getSettings,
      });
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', {
      ref: popup,
    }, slots.popup?.({ close: closeFunc.value }));
  },
});
</script>
