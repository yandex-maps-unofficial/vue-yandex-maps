<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapRotateTiltControl } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapRotateTiltControl',
    props: {
        value: {
            type: Object as PropType<YMapRotateTiltControl | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapRotateTiltControl | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapRotateTiltControl>[0]>,
            default: () => ({}),
        },
    },
    emits: {
        'input'(item: YMapRotateTiltControl): boolean {
            return true;
        },
        'update:modelValue'(item: YMapRotateTiltControl): boolean {
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
        let mapChildren: YMapRotateTiltControl | undefined;

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: ({ YMapRotateTiltControl: RotateTiltControl }) => new RotateTiltControl(props.settings),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
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
