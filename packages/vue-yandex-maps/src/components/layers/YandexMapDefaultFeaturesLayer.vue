<script lang="ts">
import { YMapDefaultFeaturesLayer } from '@yandex/ymaps3-types';
import {
  onMounted, watch, PropType, h,
  defineComponent,
} from 'vue';
import {
  insertLayerIntoMap,
} from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapDefaultFeaturesLayer',
  props: {
    value: {
      type: Object as PropType<YMapDefaultFeaturesLayer>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapDefaultFeaturesLayer>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapDefaultFeaturesLayer>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapDefaultFeaturesLayer): boolean {
      return true;
    },
    'update:modelValue'(item: YMapDefaultFeaturesLayer): boolean {
      return true;
    },
    hold(status: boolean) {
      return true;
    },
  },
  setup(props, { slots, emit }) {
    emit('hold', true);
    let mapLayer: YMapDefaultFeaturesLayer | undefined;

    watch(() => props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertLayerIntoMap(() => new ymaps3.YMapDefaultFeaturesLayer(props.settings || {}));
      emit('input', mapLayer);
      emit('update:modelValue', mapLayer);
      emit('hold', false);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
