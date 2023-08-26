<script lang="ts">
import { YMapFeature } from '@yandex/ymaps3-types';
import { defineComponent, h, onMounted, PropType, watch } from 'vue';
import { insertChildrenIntoMap } from '../composables/utils';

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

    watch(() => props, () => {
      mapChildren?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapChildren = await insertChildrenIntoMap(() => new ymaps3.YMapFeature(props.settings));
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
