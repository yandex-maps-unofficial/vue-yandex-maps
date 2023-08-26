<script lang="ts">
import { YMapDefaultSchemeLayer } from '@yandex/ymaps3-types';
import { defineComponent, h, onMounted, PropType, watch } from 'vue';
import { insertLayerIntoMap } from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapDefaultSchemeLayer',
  props: {
    value: {
      type: Object as PropType<YMapDefaultSchemeLayer>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapDefaultSchemeLayer>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapDefaultSchemeLayer>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapDefaultSchemeLayer): boolean {
      return true;
    },
    'update:modelValue'(item: YMapDefaultSchemeLayer): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapLayer: YMapDefaultSchemeLayer | undefined;

    watch(() => props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertLayerIntoMap(() => new ymaps3.YMapDefaultSchemeLayer(props.settings || {}));
      emit('input', mapLayer);
      emit('update:modelValue', mapLayer);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
