<script lang="ts">
import type { PropType } from 'vue';
import {
  computed, defineComponent, h, onMounted, ref,
} from 'vue';
import type { YMapControlButton } from '@yandex/ymaps3-types';
import { setupMapChildren } from '../../composables/utils.ts';

export type YandexMapControlButtonSettings = Omit<ConstructorParameters<typeof YMapControlButton>[0], 'element' | 'text'>

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
      type: Object as PropType<YandexMapControlButtonSettings>,
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
    const element = ref<null | HTMLDivElement>(null);

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: () => new ymaps3.YMapControlButton({
          ...props.settings,
          element: element.value!,
        }),
        settings: computed(() => ({
          ...props.settings,
          element: element.value!,
        })),
        strictMapRoot: true,
      });

      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', {
      ref: element,
    }, slots.default?.());
  },
});
</script>
