<script lang="ts">
import type { YMapCollection } from '@yandex/ymaps3-types';
import type { PropType, SlotsType } from 'vue';
import { defineComponent, h, onMounted, shallowRef } from 'vue';

import { setupMapChildren } from '../utils/setupMapChildren.ts';
import { hVue2 } from '../utils/system.ts';

export default defineComponent({
    name: 'YandexMapCollection',
    props: {
        value: {
            type: Object as PropType<YMapCollection | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapCollection | null>,
            default: null,
        },
    },
    emits: {
        'input'(item: YMapCollection): boolean {
            return true;
        },
        'update:modelValue'(item: YMapCollection): boolean {
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
        const mapChildren = shallowRef<YMapCollection | null>(null);

        onMounted(async () => {
            mapChildren.value = await setupMapChildren({
                createFunction: () => new ymaps3.YMapCollection({}),
                isMapRoot: true,
            });

            emit('input', mapChildren.value);
            emit('update:modelValue', mapChildren.value);
        });

        return () => {
            if (!mapChildren.value) return h('div');

            return () => hVue2(slots.default?.({}));
        };
    },
});
</script>
