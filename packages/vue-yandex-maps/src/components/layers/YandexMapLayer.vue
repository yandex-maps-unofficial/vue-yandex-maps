<script lang="ts">
import { YMapLayer } from '@yandex/ymaps3-types';
import {
  defineComponent, h, onMounted, PropType, watch,
} from 'vue';
import { insertLayerIntoMap } from '../../composables/utils';

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
      default: () => ({}),
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
    emit('hold', true);
    let mapLayer: YMapLayer | undefined;

    watch(() => props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertLayerIntoMap(() => new ymaps3.YMapLayer(props.settings || {}));
      emit('input', mapLayer);
      emit('update:modelValue', mapLayer);
      emit('hold', false);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
