<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import {
  defineComponent, h, onMounted, ref,
} from 'vue';
import type { YMapEntity } from '@yandex/ymaps3-types';
import { setupMapChildren } from '../utils/setupMapChildren.ts';

export default defineComponent({
  name: 'YandexMapEntity',
  props: {
    value: {
      type: Object as PropType<YMapEntity<any> | null>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapEntity<any> | null>,
      default: null,
    },
  },
  emits: {
    'input'(item: YMapEntity<any>): boolean {
      return true;
    },
    'update:modelValue'(item: YMapEntity<any>): boolean {
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
    let mapChildren: YMapEntity<any> | undefined;
    const element = ref<null | HTMLDivElement>(null);

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: () => {
          class Entity extends ymaps3.YMapEntity<any> {
            _onAttach() {
              // @ts-ignore
              this._element = element.value;
              // @ts-ignore
              this._detachDom = ymaps3.useDomContext(this, this._element);
            }

            _onDetach() {
              // @ts-ignore
              this._detachDom();
              // @ts-ignore
              this._detachDom = null;
              // @ts-ignore
              this._element = null;
            }
          }

          return new Entity({}) as YMapEntity<any>;
        },
      }) as YMapEntity<any>;
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', {
      ref: element,
    }, slots.default?.({}));
  },
});
</script>
