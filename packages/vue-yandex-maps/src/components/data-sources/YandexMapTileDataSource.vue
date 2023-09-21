<script lang="ts">
import { YMapTileDataSource } from '@yandex/ymaps3-types';
import {
  computed,
  defineComponent, h, onMounted, PropType,
  inject, Ref,
} from 'vue';
import { setupMapChildren } from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapTileDataSource',
  props: {
    value: {
      type: Object as PropType<YMapTileDataSource>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapTileDataSource>,
      default: null,
    },
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapTileDataSource>[0]>,
      default: () => ({}),
    },
  },
  emits: {
    'input'(item: YMapTileDataSource): boolean {
      return true;
    },
    'update:modelValue'(item: YMapTileDataSource): boolean {
      return true;
    },
    hold(status: boolean) {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    const hold = inject<Ref<number>>('needsToHold')!;
    hold.value++;
    let mapChildren: YMapTileDataSource | undefined;

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: () => new ymaps3.YMapTileDataSource(props.settings),
        settings: computed(() => props.settings),
        isLayer: true,
      });
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
      hold.value--;
    });

    return () => h('div', slots.default?.());
  },
});
</script>
