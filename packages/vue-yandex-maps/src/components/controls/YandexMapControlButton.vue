<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, h, onMounted, ref } from 'vue';
import type { YMapControlButton } from '@yandex/ymaps3-types';

import { setupMapChildren } from '../../utils/setupMapChildren.ts';
import { getAttrsForVueVersion, hF } from '../../utils/system.ts';

export type YandexMapControlButtonSettings = Omit<ConstructorParameters<typeof YMapControlButton>[0], 'element' | 'text'>;

export default defineComponent({
    name: 'YandexMapControlButton',
    props: {
        value: {
            type: Object as PropType<YMapControlButton | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapControlButton | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<YandexMapControlButtonSettings>,
            default: () => ({}),
        },
    },
    emits: {
        'input'(item: YMapControlButton): boolean {
            return true;
        },
        'update:modelValue'(item: YMapControlButton): boolean {
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
        let mapChildren: YMapControlButton | undefined;
        const element = ref<null | HTMLDivElement>(null);

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: () => new ymaps3.YMapControlButton({
                    ...props.settings,
                    element: element.value!,
                }),
                settings: computed(() => ({
                    ...props.settings,
                    element: element.value!,
                })),
                strictMapRoot: true,
            });

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
