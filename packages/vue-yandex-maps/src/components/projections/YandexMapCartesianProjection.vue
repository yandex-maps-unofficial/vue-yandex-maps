<script lang="ts">
import { defineComponent, h, inject, onMounted, PropType, Ref } from 'vue';
import { waitTillYmapInit } from '../../composables/utils.ts';
import { Cartesian } from '@yandex/ymaps3-types/packages/cartesian-projection';
import { Projection } from '@yandex/ymaps3-types/common/types';

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
  },
  setup(props, {
    slots,
    emit,
  }) {
    const projection = inject<Ref<null | Projection>>('projection');

    onMounted(async () => {
      await waitTillYmapInit();
      const { Cartesian } = await ymaps3.import('@yandex/ymaps3-cartesian-projection@0.0.1');

      if (projection) {
        const cartesian = new Cartesian(props.bounds, props.cycled);
        projection.value = cartesian;
        emit('input', cartesian);
        emit('update:modelValue', cartesian);
      }
    });

    return () => h('div', slots.default?.());
  },
});
</script>
