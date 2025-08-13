<script lang="ts">
import { h, shallowRef } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapSignpost } from '@yandex/ymaps3-signpost';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapSignpost',
    props: {
        value: {
            type: Object as PropType<YMapSignpost | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapSignpost | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapSignpost>[0]>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapSignpost): boolean {
            return true;
        },
        'update:modelValue'(item: YMapSignpost): boolean {
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
        const mapChildren = shallowRef<YMapSignpost | undefined>(undefined);

        onMounted(async () => {
            mapChildren.value = await setupMapChildren({
                createFunction: controls => new controls.YMapSignpost(props.settings),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-signpost'),
                settings: computed(() => props.settings),
            });
            emit('input', mapChildren.value);
            emit('update:modelValue', mapChildren.value);
        });

        return () => (mapChildren.value ? hVue2(slots.default?.({})) : h('div'));
    },
});
</script>
