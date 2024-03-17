<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import {
  computed, defineComponent, h, onMounted,
} from 'vue';
import type {
  BehaviorEvents, DomEvents, MapEvents, YMapListener,
} from '@yandex/ymaps3-types';

import { setupMapChildren } from '../utils/setupMapChildren.ts';

export type YandexMapListenerSettings = Partial<DomEvents & MapEvents & BehaviorEvents>

export default defineComponent({
  name: 'YandexMapListener',
  props: {
    value: {
      type: Object as PropType<YMapListener | null>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapListener | null>,
      default: null,
    },
    settings: {
      type: Object as PropType<YandexMapListenerSettings>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapListener): boolean {
      return true;
    },
    'update:modelValue'(item: YMapListener): boolean {
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
    let mapListener: YMapListener | undefined;

    onMounted(async () => {
      mapListener = await setupMapChildren({
        createFunction: () => new ymaps3.YMapListener(props.settings || {}),
        settings: computed(() => props.settings),
      });
      emit('input', mapListener);
      emit('update:modelValue', mapListener);
    });

    return () => h('div', slots.default?.({}));
  },
});
</script>
