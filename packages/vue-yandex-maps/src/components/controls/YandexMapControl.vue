<script lang="ts">
import {
  defineComponent, h, onMounted, PropType, watch,
} from 'vue';
import { YMapControl } from '@yandex/ymaps3-types';
import { insertControlIntoMap } from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapControl',
  props: {
    value: {
      type: Object as PropType<YMapControl>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapControl>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapControl>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapControl): boolean {
      return true;
    },
    'update:modelValue'(item: YMapControl): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapLayer: YMapControl | undefined;

    watch(() => props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertControlIntoMap(async () => new ymaps3.YMapControl(props.settings));
      emit('input', mapLayer);
      emit('update:modelValue', mapLayer);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
