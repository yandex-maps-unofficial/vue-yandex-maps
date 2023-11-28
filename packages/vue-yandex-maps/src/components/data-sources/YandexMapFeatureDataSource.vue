<script lang="ts">
import type { YMapFeatureDataSource } from '@yandex/ymaps3-types';
import type { PropType, Ref } from 'vue';
import {
  computed, defineComponent, h, inject, onMounted,
} from 'vue';
import { setupMapChildren, throwException } from '../../composables/utils';

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
      required: true,
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
      if (!props.settings.id) {
        throwException({
          text: 'You must specify id in YandexMapFeatureDataSource settings',
        });
      }

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
