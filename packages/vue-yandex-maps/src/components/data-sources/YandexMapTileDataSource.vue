<script lang="ts">
import { YMapTileDataSource } from '@yandex/ymaps3-types';
import {
  defineComponent, h, onMounted, PropType, watch,
} from 'vue';
import { insertLayerIntoMap } from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapTileDataSource',
  props: {
    value: {
      type: Object as PropType<YMapTileDataSource>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapTileDataSource>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapTileDataSource>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapTileDataSource): boolean {
      return true;
    },
    'update:modelValue'(item: YMapTileDataSource): boolean {
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
    emit('hold', false);
    let mapChildren: YMapTileDataSource | undefined;

    watch(() => props, () => {
      mapChildren?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapChildren = await insertLayerIntoMap(() => new ymaps3.YMapTileDataSource(props.settings));
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
      emit('hold', false);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
