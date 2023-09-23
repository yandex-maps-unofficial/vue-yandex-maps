<script lang="ts">
import {
  computed, defineComponent, h, onMounted, PropType,
} from 'vue';
import { YMapControl } from '@yandex/ymaps3-types';
import { setupMapChildren } from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapControl',
  props: {
    value: {
      type: Object as PropType<YMapControl>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapControl>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapControl>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapControl): boolean {
      return true;
    },
    'update:modelValue'(item: YMapControl): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapControl | undefined;

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: () => new ymaps3.YMapControl(props.settings),
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
