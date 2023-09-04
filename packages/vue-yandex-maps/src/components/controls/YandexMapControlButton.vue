<script lang="ts">
import {
  defineComponent, h, onMounted, PropType, watch,
} from 'vue';
import { YMapControlButton } from '@yandex/ymaps3-types';
import { insertControlIntoMap } from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapControlButton',
  props: {
    value: {
      type: Object as PropType<YMapControlButton>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapControlButton>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapControlButton>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapControlButton): boolean {
      return true;
    },
    'update:modelValue'(item: YMapControlButton): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapLayer: YMapControlButton | undefined;

    watch(() => props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertControlIntoMap(async () => new ymaps3.YMapControlButton(props.settings));
      emit('input', mapLayer);
      emit('update:modelValue', mapLayer);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
