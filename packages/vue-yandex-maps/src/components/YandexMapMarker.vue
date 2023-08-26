<script lang="ts">
import { YMapMarker } from '@yandex/ymaps3-types';
import { defineComponent, h, onMounted, PropType, ref, watch } from 'vue';
import { insertChildrenIntoMap } from '../composables/utils';

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

    watch(() => props, () => {
      mapChildren?.update(props.settings || {});
    }, {
      deep: true,
    });

    const element = ref<null | HTMLDivElement>(null);

    onMounted(async () => {
      mapChildren = await insertChildrenIntoMap(() => new ymaps3.YMapMarker(
          props.settings,
          element.value!,
      ));
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', {
      ref: element,
    }, slots.default?.());
  },
});
</script>
