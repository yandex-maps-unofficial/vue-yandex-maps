<script lang="ts">
import {
  computed, defineComponent, h, onMounted, PropType,
} from 'vue';
import { YMapControlButton } from '@yandex/ymaps3-types';
import { setupMapChildren } from '../../composables/utils.ts';

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
    let mapChildren: YMapControlButton | undefined;

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: () => new ymaps3.YMapControlButton(props.settings),
        settings: computed(() => props.settings),
        strictMapRoot: true,
      });

      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
