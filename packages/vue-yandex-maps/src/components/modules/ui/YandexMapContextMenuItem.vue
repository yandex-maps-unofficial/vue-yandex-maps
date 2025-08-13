<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapContextMenuItem } from '@yandex/ymaps3-context-menu';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapContextMenuItem',
    props: {
        value: {
            type: Object as PropType<YMapContextMenuItem | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapContextMenuItem | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapContextMenuItem>[0]>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapContextMenuItem): boolean {
            return true;
        },
        'update:modelValue'(item: YMapContextMenuItem): boolean {
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
        let mapChildren: YMapContextMenuItem | undefined;

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: controls => new controls.YMapContextMenuItem(props.settings),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-context-menu'),
                settings: computed(() => props.settings),
                strictMapRoot: true,
            });
            emit('input', mapChildren);
            emit('update:modelValue', mapChildren);
        });

        return () => hVue2(slots.default?.({}));
    },
});
</script>
