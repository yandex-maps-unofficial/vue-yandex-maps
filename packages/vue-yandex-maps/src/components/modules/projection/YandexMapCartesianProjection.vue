<script lang="ts">
import type { PropType, Ref } from 'vue';
import {
  defineComponent, h, inject, onMounted,
} from 'vue';
import type { Cartesian } from '@yandex/ymaps3-types/packages/cartesian-projection';
import type { Projection } from '@yandex/ymaps3-types/common/types';
import { setupMapChildren } from '../../../composables/utils.ts';

export default defineComponent({
  name: 'YandexMapCartesianProjection',
  props: {
    value: {
      type: Object as PropType<Cartesian>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<Cartesian>,
      default: null,
    },
    bounds: {
      type: Array as unknown as PropType<ConstructorParameters<typeof Cartesian>[0]>,
      required: true,
    },
    cycled: {
      type: Array as unknown as PropType<ConstructorParameters<typeof Cartesian>[1]>,
    },
  },
  emits: {
    'input'(item: Cartesian): boolean {
      return true;
    },
    'update:modelValue'(item: Cartesian): boolean {
      return true;
    },
    hold(status: boolean) {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    const hold = inject<Ref<number>>('needsToHold')!;
    hold.value++;
    const projection = inject<Ref<null | Projection>>('projection');

    onMounted(async () => {
      if (!projection) return;

      const cartesian = await setupMapChildren({
        isMercator: true,
        createFunction: ({ Cartesian: CartesianClass }) => new CartesianClass(props.bounds, props.cycled),
        requiredImport: () => ymaps3.import('@yandex/ymaps3-cartesian-projection@0.0.1'),
      });

      projection.value = cartesian;
      emit('input', cartesian);
      emit('update:modelValue', cartesian);
      hold.value--;
    });

    return () => h('div', slots.default?.());
  },
});
</script>
