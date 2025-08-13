<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapMiniMap } from '@yandex/ymaps3-minimap';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapMiniMap',
    props: {
        value: {
            type: Object as PropType<YMapMiniMap | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapMiniMap | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapMiniMap>[0]>,
            default: () => ({}),
        },
    },
    emits: {
        'input'(item: YMapMiniMap): boolean {
            return true;
        },
        'update:modelValue'(item: YMapMiniMap): boolean {
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
        let mapChildren: YMapMiniMap | undefined;

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: controls => new controls.YMapMiniMap(props.settings),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-minimap'),
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
