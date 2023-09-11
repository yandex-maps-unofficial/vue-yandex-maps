<script lang="ts">
import { YMapControls } from '@yandex/ymaps3-types';
import {
  defineComponent, h, onMounted, PropType, provide, Ref, ref, shallowRef, watch, nextTick,
} from 'vue';
import { waitTillMapInit, injectMap } from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapControls',
  props: {
    value: {
      type: Object as PropType<YMapControls>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapControls>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapControls>[0]>,
      default: () => ({}),
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
  setup(props, { slots, emit }) {
    const mapChildren: Ref<YMapControls | null> = shallowRef(null);
    const controlInitPromises = ref<PromiseLike<any>[]>([]);
    provide('control', mapChildren);
    provide('controlInitPromises', controlInitPromises);

    watch(() => props, () => {
      mapChildren.value?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      const map = injectMap();
      await waitTillMapInit();
      mapChildren.value = new ymaps3.YMapControls(props.settings);

      await nextTick();
      await Promise.all(controlInitPromises.value);
      map?.value?.addChild(mapChildren.value);
      emit('input', mapChildren.value);
      emit('update:modelValue', mapChildren.value);
    });

    return () => (mapChildren.value ? h('div', slots.default?.()) : h('div'));
  },
});
</script>
