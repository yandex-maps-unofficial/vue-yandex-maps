<script lang="ts">
import { toRef } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapTiltControl } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapTiltControl',
    props: {
        value: {
            type: Object as PropType<YMapTiltControl | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapTiltControl | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapTiltControl>[0]>,
            default: () => ({}),
        },
        index: Number,
    },
    emits: {
        'input'(item: YMapTiltControl): boolean {
            return true;
        },
        'update:modelValue'(item: YMapTiltControl): boolean {
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
        let mapChildren: YMapTiltControl | undefined;

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: ({ YMapTiltControl: TiltControl }) => new TiltControl(props.settings),
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
