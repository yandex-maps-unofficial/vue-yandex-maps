<script lang="ts">
import { YMapLayer } from '@yandex/ymaps3-types';
import {
  computed, defineComponent, h, inject, onMounted, PropType, Ref,
} from 'vue';
import { setupMapChildren } from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapLayer',
  props: {
    value: {
      type: Object as PropType<YMapLayer>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapLayer>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapLayer>[0]>,
      default: () => ({}),
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
  setup(props, {
    slots,
    emit,
  }) {
    const hold = inject<Ref<number>>('needsToHold')!;
    hold.value++;
    let mapLayer: YMapLayer | undefined;

    onMounted(async () => {
      mapLayer = await setupMapChildren({
        createFunction: () => new ymaps3.YMapLayer(props.settings || {}),
        settings: computed(() => props.settings),
        isLayer: true,
      });

      emit('input', mapLayer);
      emit('update:modelValue', mapLayer);
      hold.value--;
    });

    return () => h('div', slots.default?.());
  },
});
</script>
