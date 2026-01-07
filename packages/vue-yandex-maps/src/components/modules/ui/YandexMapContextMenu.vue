<script lang="ts">
import { h, shallowRef } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { provideMapRoot, setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapContextMenu } from '@yandex/ymaps3-context-menu';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapContextMenu',
    props: {
        value: {
            type: Object as PropType<YMapContextMenu | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapContextMenu | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapContextMenu>[0]>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapContextMenu): boolean {
            return true;
        },
        'update:modelValue'(item: YMapContextMenu): boolean {
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
        const mapChildren = shallowRef<YMapContextMenu | undefined>(undefined);
        const mapRoot = provideMapRoot();

        onMounted(async () => {
            mapChildren.value = await setupMapChildren({
                createFunction: controls => new controls.YMapContextMenu(props.settings),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-context-menu'),
                settings: computed(() => props.settings),
                mapRoot,
            });
            emit('input', mapChildren.value);
            emit('update:modelValue', mapChildren.value);
        });

        return () => (mapChildren.value ? hVue2(slots.default?.({})) : h('div'));
    },
});
</script>
