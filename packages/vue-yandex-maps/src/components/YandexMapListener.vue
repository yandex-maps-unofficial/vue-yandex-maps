<script lang="ts">
import {
  defineComponent, h, onMounted, PropType, watch,
} from 'vue';
import {
  BehaviorEvents, DomEvents, MapEvents, YMapListener,
} from '@yandex/ymaps3-types';
import { insertChildrenIntoMap } from '../composables/utils';

export default defineComponent({
  name: 'YandexMapListener',
  props: {
    value: {
      type: Object as PropType<YMapListener>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapListener>,
      default: null,
    },
    settings: {
      type: Object as PropType<Partial<DomEvents & MapEvents & BehaviorEvents>>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapListener): boolean {
      return true;
    },
    'update:modelValue'(item: YMapListener): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapListener: YMapListener | undefined;

    watch(() => props, () => {
      mapListener?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapListener = await insertChildrenIntoMap(() => new ymaps3.YMapListener(props.settings || {}));
      emit('input', mapListener);
      emit('update:modelValue', mapListener);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
