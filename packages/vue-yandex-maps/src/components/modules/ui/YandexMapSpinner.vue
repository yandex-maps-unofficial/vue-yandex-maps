<script lang="ts">
import { h, shallowRef } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapSpinner } from '@yandex/ymaps3-spinner';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapSpinner',
    props: {
        value: {
            type: Object as PropType<YMapSpinner | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapSpinner | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapSpinner>[0]>,
            default: () => ({}),
        },
    },
    emits: {
        'input'(item: YMapSpinner): boolean {
            return true;
        },
        'update:modelValue'(item: YMapSpinner): boolean {
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
        const mapChildren = shallowRef<YMapSpinner | undefined>(undefined);

        onMounted(async () => {
            mapChildren.value = await setupMapChildren({
                createFunction: controls => new controls.YMapSpinner(props.settings),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-spinner'),
                settings: computed(() => props.settings),
            });
            emit('input', mapChildren.value);
            emit('update:modelValue', mapChildren.value);
        });

        return () => (mapChildren.value ? hVue2(slots.default?.({})) : h('div'));
    },
});
</script>
