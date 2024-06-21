<script lang="ts">
import type { PropType, Ref, SlotsType } from 'vue';
import { defineComponent, inject, onMounted } from 'vue';
import type { Cartesian } from '@yandex/ymaps3-types/packages/cartesian-projection';
import type { Projection } from '@yandex/ymaps3-types/common/types';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hVue2 } from '../../../utils/system.ts';

export default defineComponent({
    name: 'YandexMapCartesianProjection',
    props: {
        value: {
            type: Object as PropType<Cartesian | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<Cartesian | null>,
            default: null,
        },
        bounds: {
            type: Array as unknown as PropType<ConstructorParameters<typeof Cartesian>[0]>,
            required: true,
        },
        cycled: {
            type: Array as unknown as PropType<ConstructorParameters<typeof Cartesian>[1]>,
        },
    },
    emits: {
        'input'(item: Cartesian): boolean {
            return true;
        },
        'update:modelValue'(item: Cartesian): boolean {
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
        const hold = inject<Ref<number>>('needsToHold')!;
        hold.value++;
        const projection = inject<Ref<null | Projection>>('projection');

        onMounted(async () => {
            if (!projection) return;

            const cartesian = await setupMapChildren({
                isMercator: true,
                createFunction: ({ Cartesian: CartesianClass }) => new CartesianClass(props.bounds, props.cycled),
                requiredImport: () => ymaps3.import('@yandex/ymaps3-cartesian-projection@0.0.1'),
            });

            projection.value = cartesian;
            emit('input', cartesian);
            emit('update:modelValue', cartesian);
            hold.value--;
        });

        return () => hVue2(slots.default?.({}));
    },
});
</script>
