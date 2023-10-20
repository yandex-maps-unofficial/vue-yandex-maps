<script lang="ts">
import {
  computed, defineComponent, h, onMounted, PropType, ref,
} from 'vue';
import type { YMapControl } from '@yandex/ymaps3-types';
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
    const element = ref<null | HTMLDivElement>(null);

    onMounted(async () => {
      mapChildren = await setupMapChildren({
        createFunction: () => {
          const control = new ymaps3.YMapControl(props.settings);

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
        settings: computed(() => props.settings),
        strictMapRoot: true,
      });
      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    return () => h('div', {
      ref: element,
    }, slots.default?.());
  },
});
</script>
