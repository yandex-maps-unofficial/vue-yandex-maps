<script lang="ts">
import {
  defineComponent, h, onMounted, PropType, watch,
} from 'vue';
import { YMapOpenMapsButton } from '@yandex/ymaps3-types/modules/controls-extra';
import { insertControlIntoMap } from '../../composables/utils.ts';

export default defineComponent({
  name: 'YandexMapOpenMapsButton',
  props: {
    value: {
      type: Object as PropType<YMapOpenMapsButton>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapOpenMapsButton>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapOpenMapsButton>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapOpenMapsButton): boolean {
      return true;
    },
    'update:modelValue'(item: YMapOpenMapsButton): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapOpenMapsButton | undefined;

    watch(() => props, () => {
      mapChildren?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapChildren = await insertControlIntoMap(() => ymaps3.import('@yandex/ymaps3-controls-extra'), ({ YMapOpenMapsButton: OpenMapsButton }) => new OpenMapsButton(props.settings));

      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
