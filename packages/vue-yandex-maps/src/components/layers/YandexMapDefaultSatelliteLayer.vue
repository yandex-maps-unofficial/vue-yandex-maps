<script lang="ts">
import type { YMapDefaultSatelliteLayer } from '@yandex/ymaps3-types';
import type { PropType, Ref, SlotsType } from 'vue';
import {
  computed, defineComponent, h, inject, onMounted,
} from 'vue';

import { setupMapChildren } from '../../composables/utils/setupMapChildren.ts';

export default defineComponent({
  name: 'YandexMapDefaultSatelliteLayer',
  props: {
    value: {
      type: Object as PropType<YMapDefaultSatelliteLayer>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapDefaultSatelliteLayer>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapDefaultSatelliteLayer>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapDefaultSatelliteLayer): boolean {
      return true;
    },
    'update:modelValue'(item: YMapDefaultSatelliteLayer): boolean {
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
    let mapLayer: YMapDefaultSatelliteLayer | undefined;

    onMounted(async () => {
      mapLayer = await setupMapChildren({
        createFunction: () => new ymaps3.YMapDefaultSatelliteLayer(props.settings || {}),
        settings: computed(() => props.settings),
        isLayer: true,
      });
      emit('input', mapLayer);
      emit('update:modelValue', mapLayer);
      hold.value--;
    });

    return () => h('div', slots.default?.({}));
  },
});
</script>
