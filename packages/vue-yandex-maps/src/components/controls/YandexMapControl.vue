<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import {
  defineComponent, h, onMounted, ref,
} from 'vue';
import type { YMapControl } from '@yandex/ymaps3-types';

import { setupMapChildren } from '../../composables/utils/setupMapChildren.ts';

export default defineComponent({
  name: 'YandexMapControl',
  props: {
    value: {
      type: Object as PropType<YMapControl | null>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapControl | null>,
      default: null,
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
  slots: Object as SlotsType<{
    default: {},
  }>,
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapControl | undefined;
    const element = ref<null | HTMLDivElement>(null);

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: () => {
          const control = new ymaps3.YMapControl();

          class YMapSomeController extends ymaps3.YMapEntity<any> {
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

          control.addChild(new YMapSomeController({}));
          return control;
        },
        strictMapRoot: true,
      });
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', {
      ref: element,
    }, slots.default?.({}));
  },
});
</script>
