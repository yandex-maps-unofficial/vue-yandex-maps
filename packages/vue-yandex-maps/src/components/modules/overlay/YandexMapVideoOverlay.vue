<script lang="ts">
import { shallowRef } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapVideoOverlay } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapVideoOverlay',
    props: {
        value: {
            type: Object as PropType<YMapVideoOverlay | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapVideoOverlay | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapVideoOverlay>[0]>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapVideoOverlay): boolean {
            return true;
        },
        'update:modelValue'(item: YMapVideoOverlay): boolean {
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
        const mapChildren = shallowRef<YMapVideoOverlay | undefined>(undefined);

        onMounted(async () => {
            mapChildren.value = await setupMapChildren({
                createFunction: theme => new theme.YMapVideoOverlay(props.settings),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
                settings: computed(() => props.settings),
            });
            emit('input', mapChildren.value);
            emit('update:modelValue', mapChildren.value);
        });

        return () => hVue2(slots.default?.({}));
    },
});
</script>
