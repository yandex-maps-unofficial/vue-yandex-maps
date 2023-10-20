<script lang="ts">
import {
  computed, defineComponent, h, onMounted, PropType,
} from 'vue';
import type {
  BehaviorEvents, DomEvents, MapEvents, YMapListener,
} from '@yandex/ymaps3-types';
import { setupMapChildren } from '../composables/utils.ts';

export default defineComponent({
  name: 'YandexMapListener',
  props: {
    value: {
      type: Object as PropType<YMapListener>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapListener>,
      default: null,
    },
    settings: {
      type: Object as PropType<Partial<DomEvents & MapEvents & BehaviorEvents>>,
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

    return () => h('div', slots.default?.());
  },
});
</script>
