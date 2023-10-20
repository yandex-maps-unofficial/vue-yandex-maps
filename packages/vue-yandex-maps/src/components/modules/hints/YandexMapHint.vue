<script lang="ts">
import {
  defineComponent, h, onMounted, PropType, shallowRef,
} from 'vue';
import type { YMapHint } from '@yandex/ymaps3-types/packages/hint';
import { setupMapChildren } from '../../../composables/utils.ts';

export default defineComponent({
  name: 'YandexMapHint',
  props: {
    value: {
      type: Object as PropType<YMapHint>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapHint>,
      default: null,
    },
    // Property that you will set on YandexMapMarker or YandexMapFeature to display hint content
    hintProperty: {
      type: String,
      required: true,
    },
  },
  emits: {
    'input'(item: YMapHint): boolean {
      return true;
    },
    'update:modelValue'(item: YMapHint): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildren: YMapHint | undefined;
    const element = shallowRef<null | HTMLDivElement>(null);
    const hintContent = shallowRef('');

    onMounted(async () => {
      await setupMapChildren({
        createFunction: ({
          YMapHint: MapHint,
          YMapHintContext,
        }) => {
          mapChildren = new MapHint({
            hint: (object) => object?.properties?.[props.hintProperty],
          });

          class Hint extends ymaps3.YMapEntity<{}> {
            _onAttach() {
              const e = this as any;

              e._element = element.value;

              e._detachDom = ymaps3.useDomContext(e, e._element, null);

              e._watchContext(YMapHintContext, () => {
                hintContent.value = e._consumeContext(YMapHintContext)?.[props.hintProperty];
              }, { immediate: true });
            }

            _onDetach() {
              // @ts-expect-error
              this._detachDom();
            }
          }

          mapChildren.addChild(new Hint({}));
          return mapChildren;
        },
        requiredImport: () => ymaps3.import('@yandex/ymaps3-hint@0.0.1'),
      });

      emit('input', mapChildren!);
      emit('update:modelValue', mapChildren!);
    });

    return () => h('div', {
      ref: element,
    }, slots.default?.({ content: hintContent.value }));
  },
});
</script>
