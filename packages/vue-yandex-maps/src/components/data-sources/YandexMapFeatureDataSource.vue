<script lang="ts">
import { YMapFeatureDataSource } from '@yandex/ymaps3-types';
import {
  computed, defineComponent, h, inject, onMounted, PropType, Ref,
} from 'vue';
import { setupMapChildren } from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapFeatureDataSource',
  props: {
    value: {
      type: Object as PropType<YMapFeatureDataSource>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapFeatureDataSource>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapFeatureDataSource>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapFeatureDataSource): boolean {
      return true;
    },
    'update:modelValue'(item: YMapFeatureDataSource): boolean {
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
    let mapChildren: YMapFeatureDataSource | undefined;

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: () => new ymaps3.YMapFeatureDataSource(props.settings),
        settings: computed(() => props.settings),
        isLayer: true,
      });
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
      hold.value--;
    });

    return () => h('div', slots.default?.());
  },
});
</script>
