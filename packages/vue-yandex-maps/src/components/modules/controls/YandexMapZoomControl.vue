<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import {
  computed, defineComponent, h, onMounted,
} from 'vue';
import type { YMapZoomControl } from '@yandex/ymaps3-types/packages/controls';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';

export default defineComponent({
  name: 'YandexMapZoomControl',
  props: {
    value: {
      type: Object as PropType<YMapZoomControl | null>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapZoomControl | null>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapZoomControl>[0]>,
      default: () => ({}),
    },
  },
  slots: Object as SlotsType<{
    default: {},
  }>,
  emits: {
    'input'(item: YMapZoomControl): boolean {
      return true;
    },
    'update:modelValue'(item: YMapZoomControl): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapZoomControl | undefined;

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: (controls) => new controls.YMapZoomControl(props.settings),
        requiredImport: () => ymaps3.import('@yandex/ymaps3-controls@0.0.1'),
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
