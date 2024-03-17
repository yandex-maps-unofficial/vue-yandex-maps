<script lang="ts">
import type { YMapControls } from '@yandex/ymaps3-types';
import type { PropType, Ref, SlotsType } from 'vue';
import {
  computed, defineComponent, h, onMounted, shallowRef,
} from 'vue';
import { throwException } from '../../utils/system.ts';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';

export default defineComponent({
  name: 'YandexMapControls',
  props: {
    value: {
      type: Object as PropType<YMapControls | null>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapControls | null>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapControls>[0]>,
      required: true,
    },
  },
  emits: {
    'input'(item: YMapControls): boolean {
      return true;
    },
    'update:modelValue'(item: YMapControls): boolean {
      return true;
    },
  },
  slots: Object as SlotsType<{
    default: {},
  }>,
  setup(props, {
    slots,
    emit,
  }) {
    const mapChildren: Ref<YMapControls | null> = shallowRef(null);

    onMounted(async () => {
      if (!props.settings.position) {
        throwException({
          text: 'You must specify position in YandexMapControls settings',
        });
      }

      mapChildren.value = await setupMapChildren({
        createFunction: () => new ymaps3.YMapControls(props.settings),
        isMapRoot: true,
        settings: computed(() => props.settings),
      });

      emit('input', mapChildren.value);
      emit('update:modelValue', mapChildren.value);
    });

    return () => (mapChildren.value ? h('div', slots.default?.({})) : h('div'));
  },
});
</script>
