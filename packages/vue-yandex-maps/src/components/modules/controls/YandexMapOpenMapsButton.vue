<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import {
  computed, defineComponent, h, onMounted,
} from 'vue';
import type { YMapOpenMapsButton } from '@yandex/ymaps3-types/modules/controls-extra';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';

export default defineComponent({
  name: 'YandexMapOpenMapsButton',
  props: {
    value: {
      type: Object as PropType<YMapOpenMapsButton | null>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapOpenMapsButton | null>,
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
  slots: Object as SlotsType<{
    default: {},
  }>,
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapOpenMapsButton | undefined;

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: ({ YMapOpenMapsButton: OpenMapsButton }) => new OpenMapsButton(props.settings),
        requiredImport: () => ymaps3.import('@yandex/ymaps3-controls-extra'),
        settings: computed(() => props.settings),
        strictMapRoot: true,
      });

      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => hVue2(slots.default?.({}));
  },
});
</script>
