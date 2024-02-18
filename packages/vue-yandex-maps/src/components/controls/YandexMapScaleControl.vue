<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import {
  computed, defineComponent, h, onMounted,
} from 'vue';

import { setupMapChildren } from '../../composables/utils/setupMapChildren.ts';
import type { YMapScaleControl } from '@yandex/ymaps3-types/modules/controls-extra/YMapScaleControl';

interface ClassType<T, P extends any[]> extends Function {
  new (...args: P): T;
}

export default defineComponent({
  name: 'YandexMapScaleControl',
  props: {
    value: {
      type: Object as PropType<YMapScaleControl | null>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapScaleControl | null>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapScaleControl>[0]>,
      default: () => ({}),
    },
  },
  slots: Object as SlotsType<{
    default: {},
  }>,
  emits: {
    'input'(item: YMapScaleControl): boolean {
      return true;
    },
    'update:modelValue'(item: YMapScaleControl): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapScaleControl | undefined;

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: (controls) => new (ymaps3 as unknown as {
          YMapScaleControl: ClassType<YMapScaleControl, ConstructorParameters<typeof YMapScaleControl>>
        }).YMapScaleControl(props.settings),
        settings: computed(() => props.settings),
        strictMapRoot: true,
      });
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', slots.default?.({}));
  },
});
</script>
