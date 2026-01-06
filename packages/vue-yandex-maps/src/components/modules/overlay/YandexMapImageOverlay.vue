<script lang="ts">
import { shallowRef } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapImageOverlay } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapImageOverlay',
    props: {
        value: {
            type: Object as PropType<YMapImageOverlay | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapImageOverlay | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapImageOverlay>[0]>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapImageOverlay): boolean {
            return true;
        },
        'update:modelValue'(item: YMapImageOverlay): boolean {
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
        const mapChildren = shallowRef<YMapImageOverlay | undefined>(undefined);

        onMounted(async () => {
            mapChildren.value = await setupMapChildren({
                createFunction: theme => new theme.YMapImageOverlay(props.settings),
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
