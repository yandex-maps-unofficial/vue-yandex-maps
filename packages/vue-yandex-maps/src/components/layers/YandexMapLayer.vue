<script lang="ts">
import type { YMapLayer } from '@yandex/ymaps3-types';
import type { PropType, Ref, SlotsType } from 'vue';
import {
  computed, defineComponent, inject, onMounted,
} from 'vue';
import { hVue2, throwException } from '../../utils/system.ts';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';

export default defineComponent({
  name: 'YandexMapLayer',
  props: {
    value: {
      type: Object as PropType<YMapLayer | null>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapLayer | null>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapLayer>[0]>,
      required: true,
    },
  },
  emits: {
    'input'(item: YMapLayer): boolean {
      return true;
    },
    'update:modelValue'(item: YMapLayer): boolean {
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
    let mapLayer: YMapLayer | undefined;

    onMounted(async () => {
      if (!props.settings.type) {
        throwException({
          text: 'You must specify type in YandexMapLayer settings',
        });
      }

      mapLayer = await setupMapChildren({
        createFunction: () => new ymaps3.YMapLayer(props.settings || {}),
        settings: computed(() => props.settings),
        isLayer: true,
      });

      emit('input', mapLayer);
      emit('update:modelValue', mapLayer);
      hold.value--;
    });

    return () => hVue2(slots.default?.({}));
  },
});
</script>
