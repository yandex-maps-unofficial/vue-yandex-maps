<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { defineComponent, h, onMounted, ref } from 'vue';
import type { YMapEntity } from '@yandex/ymaps3-types';
import { setupMapChildren } from '../utils/setupMapChildren.ts';
import { getAttrsForVueVersion, hF } from '../utils/system.ts';

export default defineComponent({
    name: 'YandexMapEntity',
    inheritAttrs: false,
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
        default: {};
    }>,
    setup(props, {
        slots,
        emit,
        attrs,
    }) {
        let mapChildren: YMapEntity<any> | undefined;
        const element = ref<null | HTMLDivElement>(null);

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: () => {
                    class Entity extends ymaps3.YMapEntity<any> {
                        _onAttach() {
                            // @ts-expect-error restricted key
                            this._element = element.value;
                            // @ts-expect-error restricted key
                            this._detachDom = ymaps3.useDomContext(this, this._element);
                        }

                        _onDetach() {
                            // @ts-expect-error restricted key
                            this._detachDom();
                            // @ts-expect-error restricted key
                            this._detachDom = null;
                            // @ts-expect-error restricted key
                            this._element = null;
                        }
                    }

                    return new Entity({}) as YMapEntity<any>;
                },
            }) as YMapEntity<any>;
            emit('input', mapChildren);
            emit('update:modelValue', mapChildren);
        });

        return () => hF([
            h('div', {
                ref: element,
                ...getAttrsForVueVersion(attrs),
            }, slots.default?.({})),
        ]);
    },
});
</script>
