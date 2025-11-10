<script lang="ts">
import { toRef } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapRotateControl } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapRotateControl',
    props: {
        value: {
            type: Object as PropType<YMapRotateControl | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapRotateControl | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapRotateControl>[0]>,
            default: () => ({}),
        },
        index: Number,
    },
    emits: {
        'input'(item: YMapRotateControl): boolean {
            return true;
        },
        'update:modelValue'(item: YMapRotateControl): boolean {
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
        let mapChildren: YMapRotateControl | undefined;

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: ({ YMapRotateControl: RotateControl }) => new RotateControl(props.settings),
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
