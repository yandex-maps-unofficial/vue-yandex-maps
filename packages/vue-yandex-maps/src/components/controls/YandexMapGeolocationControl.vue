<script lang="ts">
import {
  onMounted, watch, PropType, h,
  defineComponent,
} from 'vue';
import { YMapGeolocationControl } from '@yandex/ymaps3-types/packages/controls';
import {
  insertControlIntoMap,
} from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapGeolocationControl',
  props: {
    value: {
      type: Object as PropType<YMapGeolocationControl>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapGeolocationControl>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapGeolocationControl>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapGeolocationControl): boolean {
      return true;
    },
    'update:modelValue'(item: YMapGeolocationControl): boolean {
      return true;
    },
  },
  setup(props, { slots, emit }) {
    let mapLayer: YMapGeolocationControl | undefined;

    watch(() => props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertControlIntoMap(() => ymaps3.import('@yandex/ymaps3-controls@0.0.1'), async (controls) => new controls.YMapGeolocationControl(props.settings));
      emit('input', mapLayer);
      emit('update:modelValue', mapLayer);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
