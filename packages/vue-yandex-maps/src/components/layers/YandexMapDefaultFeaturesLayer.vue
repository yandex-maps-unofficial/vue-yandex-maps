<script lang="ts">
import type { YMapDefaultFeaturesLayer } from '@yandex/ymaps3-types';
import type { PropType, Ref } from 'vue';
import {
  computed, defineComponent, h, inject, onMounted,
} from 'vue';
import { setupMapChildren } from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapDefaultFeaturesLayer',
  props: {
    value: {
      type: Object as PropType<YMapDefaultFeaturesLayer>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapDefaultFeaturesLayer>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapDefaultFeaturesLayer>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapDefaultFeaturesLayer): boolean {
      return true;
    },
    'update:modelValue'(item: YMapDefaultFeaturesLayer): boolean {
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
    let mapLayer: YMapDefaultFeaturesLayer | undefined;

    onMounted(async () => {
      mapLayer = await setupMapChildren({
        createFunction: () => new ymaps3.YMapDefaultFeaturesLayer(props.settings || {}),
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
