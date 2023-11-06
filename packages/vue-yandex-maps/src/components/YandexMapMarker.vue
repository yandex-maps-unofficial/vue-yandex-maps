<script lang="ts">
import type { YMapMarker } from '@yandex/ymaps3-types';
import type { PropType } from 'vue';
import {
  computed, defineComponent, h, onMounted, ref,
} from 'vue';
import { setupMapChildren } from '../composables/utils';

export default defineComponent({
  name: 'YandexMapMarker',
  props: {
    value: {
      type: Object as PropType<YMapMarker>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapMarker>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapMarker>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapMarker): boolean {
      return true;
    },
    'update:modelValue'(item: YMapMarker): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapMarker | undefined;

    const element = ref<null | HTMLDivElement>(null);

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        settings: computed(() => props.settings),
        createFunction: () => new ymaps3.YMapMarker(props.settings, element.value!),
      });
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', {
      ref: element,
    }, slots.default?.());
  },
});
</script>
