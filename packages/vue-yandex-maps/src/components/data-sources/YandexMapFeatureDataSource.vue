<script lang="ts">
import { YMapFeatureDataSource } from '@yandex/ymaps3-types';
import { defineComponent, h, onMounted, PropType, watch } from 'vue';
import { insertLayerIntoMap } from '../../composables/utils';

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
    emit('hold', true);
    let mapChildren: YMapFeatureDataSource | undefined;

    watch(() => props, () => {
      mapChildren?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapChildren = await insertLayerIntoMap(() => new ymaps3.YMapFeatureDataSource(props.settings));
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
      emit('hold', false);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
