<script lang="ts">
import type { PropType, Ref, SlotsType } from 'vue';
import {
  defineComponent, h, inject, onMounted,
} from 'vue';
import type { Projection } from '@yandex/ymaps3-types/common/types';

import { setupMapChildren } from '../../../composables/utils/setupMapChildren.ts';

export default defineComponent({
  name: 'YandexMapSphericalMercatorProjection',
  props: {
    value: {
      type: Object as PropType<Projection | null>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<Projection | null>,
      default: null,
    },
  },
  emits: {
    'input'(item: Projection): boolean {
      return true;
    },
    'update:modelValue'(item: Projection): boolean {
      return true;
    },
    hold(status: boolean) {
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
    const hold = inject<Ref<number>>('needsToHold')!;
    hold.value++;
    const projection = inject<Ref<null | Projection>>('projection');

    onMounted(async () => {
      if (!projection) {
        hold.value--;
        return;
      }

      const mercator = await setupMapChildren({
        isMercator: true,
        createFunction: ({ SphericalMercator: Mercator }) => new Mercator(),
        requiredImport: () => ymaps3.import('@yandex/ymaps3-spherical-mercator-projection@0.0.1'),
      });

      projection.value = mercator;
      emit('input', mercator);
      emit('update:modelValue', mercator);

      hold.value--;
    });

    return () => h('div', slots.default?.({}));
  },
});
</script>
