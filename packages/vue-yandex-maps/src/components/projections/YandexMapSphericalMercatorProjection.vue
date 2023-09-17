<script lang="ts">
import {
  defineComponent, h, inject, onMounted, PropType, Ref,
} from 'vue';
import { Projection } from '@yandex/ymaps3-types/common/types';
import { SphericalMercator } from '@yandex/ymaps3-types/packages/spherical-mercator-projection';
import { setupMapChildren } from '../../composables/utils.ts';

export default defineComponent({
  name: 'YandexMapSphericalMercatorProjection',
  props: {
    value: {
      type: Object as PropType<SphericalMercator>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<SphericalMercator>,
      default: null,
    },
  },
  emits: {
    'input'(item: SphericalMercator): boolean {
      return true;
    },
    'update:modelValue'(item: SphericalMercator): boolean {
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
    emit('hold', true);
    const projection = inject<Ref<null | Projection>>('projection');

    onMounted(async () => {
      if (!projection) return;

      const mercator = await setupMapChildren({
        returnOnly: true,
        createFunction: ({ SphericalMercator: Mercator }) => new Mercator(),
        requiredImport: () => ymaps3.import('@yandex/ymaps3-spherical-mercator-projection@0.0.1'),
      });

      projection.value = mercator;
      emit('input', mercator);
      emit('update:modelValue', mercator);

      emit('hold', false);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
