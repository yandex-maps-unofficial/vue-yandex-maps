<script lang="ts">
import { toRef } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapSearchControl } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapSearchControl',
    props: {
        value: {
            type: Object as PropType<YMapSearchControl | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapSearchControl | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapSearchControl>[0]>,
            required: true,
        },
        index: Number,
    },
    emits: {
        'input'(item: YMapSearchControl): boolean {
            return true;
        },
        'update:modelValue'(item: YMapSearchControl): boolean {
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
        let mapChildren: YMapSearchControl | undefined;

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: ({ YMapSearchControl: TiltControl }) => new TiltControl(props.settings),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
                settings: computed(() => props.settings),
                strictMapRoot: true,
                index: toRef(props, 'index'),
            });
            emit('input', mapChildren);
            emit('update:modelValue', mapChildren);
        });

        return () => hVue2(slots.default?.({}));
    },
});
</script>
