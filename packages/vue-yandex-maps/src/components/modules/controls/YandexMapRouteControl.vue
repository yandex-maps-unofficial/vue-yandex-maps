<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';
import type { YMapRouteControl } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapRouteControl',
    props: {
        value: {
            type: Object as PropType<YMapRouteControl | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapRouteControl | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapRouteControl>[0]>,
            default: () => ({}),
        },
    },
    emits: {
        'input'(item: YMapRouteControl): boolean {
            return true;
        },
        'update:modelValue'(item: YMapRouteControl): boolean {
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
        let mapChildren: YMapRouteControl | undefined;

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: ({ YMapRouteControl: TiltControl }) => new TiltControl(props.settings),
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
