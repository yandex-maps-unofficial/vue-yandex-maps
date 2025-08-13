<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapResizer } from '@yandex/ymaps3-resizer';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapResizer',
    props: {
        value: {
            type: Object as PropType<YMapResizer | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapResizer | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapResizer>[0]>,
            default: () => ({}),
        },
    },
    emits: {
        'input'(item: YMapResizer): boolean {
            return true;
        },
        'update:modelValue'(item: YMapResizer): boolean {
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
        let mapChildren: YMapResizer | undefined;

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: controls => new controls.YMapResizer(props.settings),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-resizer'),
                settings: computed(() => props.settings),
            });
            emit('input', mapChildren);
            emit('update:modelValue', mapChildren);
        });

        return () => hVue2(slots.default?.({}));
    },
});
</script>
