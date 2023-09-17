<script lang="ts">
import { YMapFeature } from '@yandex/ymaps3-types';
import {
  computed, defineComponent, h, onMounted, PropType,
} from 'vue';
import { setupMapChildren } from '../composables/utils';

export default defineComponent({
  name: 'YandexMapFeature',
  props: {
    value: {
      type: Object as PropType<YMapFeature>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapFeature>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapFeature>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapFeature): boolean {
      return true;
    },
    'update:modelValue'(item: YMapFeature): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapFeature | undefined;

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: () => new ymaps3.YMapFeature(props.settings),
        settings: computed(() => props.settings),
      });
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
