<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, h, onMounted, ref, shallowRef } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hF } from '../../../utils/system.ts';
import type { YMapDrawerControl } from '@yandex/ymaps3-drawer-control';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapDrawerControl',
    props: {
        value: {
            type: Object as PropType<YMapDrawerControl | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapDrawerControl | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<Omit<ConstructorParameters<typeof YMapDrawerControl>[0], 'content'>>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapDrawerControl): boolean {
            return true;
        },
        'update:modelValue'(item: YMapDrawerControl): boolean {
            return true;
        },
    },
    slots: Object as SlotsType<{
        default: {};
    }>,
    setup(props, {
        slots,
        emit,
    }) {
        const content = ref<HTMLDivElement | null>(null);
        const mapChildren = shallowRef<YMapDrawerControl | undefined>(undefined);

        const contentFunc = () => {
            return content.value!;
        };

        const getSettings = computed<ConstructorParameters<typeof YMapDrawerControl>[0]>(() => {
            return { ...props.settings, content: contentFunc };
        });

        onMounted(async () => {
            mapChildren.value = await setupMapChildren({
                createFunction: controls => new controls.YMapDrawerControl(getSettings.value),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-drawer-control'),
                settings: getSettings,
            });
            emit('input', mapChildren.value);
            emit('update:modelValue', mapChildren.value);
        });

        return () => {
            return hF([
                h('div', {
                    ref: content,
                }, slots.default?.({})),
            ]);
        };
    },
});
</script>
