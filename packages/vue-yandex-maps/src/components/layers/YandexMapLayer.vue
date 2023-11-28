<script lang="ts">
import type { YMapLayer } from '@yandex/ymaps3-types';
import type { PropType, Ref } from 'vue';
import {
  computed, defineComponent, h, inject, onMounted,
} from 'vue';
import { setupMapChildren, throwException } from '../../composables/utils';

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

    return () => h('div', slots.default?.());
  },
});
</script>
