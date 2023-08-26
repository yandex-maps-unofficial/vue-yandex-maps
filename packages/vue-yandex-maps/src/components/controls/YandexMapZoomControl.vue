<script lang="ts">
import {
  onMounted, watch, PropType, h,
  defineComponent,
} from 'vue';
import { YMapZoomControl } from '@yandex/ymaps3-types/packages/controls';
import {
  insertControlIntoMap,
} from '../../composables/utils';
import { YMapLayer } from '@yandex/ymaps3-types';

export default defineComponent({
  name: 'YandexMapZoomControl',
  props: {
    value: {
      type: Object as PropType<YMapZoomControl>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapZoomControl>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapZoomControl>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapZoomControl): boolean {
      return true;
    },
    'update:modelValue'(item: YMapZoomControl): boolean {
      return true;
    },
  },
  setup(props, { slots, emit }) {
    let mapLayer: YMapZoomControl | undefined;

    watch(() => props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertControlIntoMap(() => ymaps3.import('@yandex/ymaps3-controls@0.0.1'), async (controls) => new controls.YMapZoomControl(props.settings));
      emit('input', mapLayer);
      emit('update:modelValue', mapLayer);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
