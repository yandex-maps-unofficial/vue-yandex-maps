<script lang="ts">
import { toRef } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../utils/setupMapChildren.ts';
import type { YMapScaleControl } from '@yandex/ymaps3-types';
import { hVue2 } from '../../utils/system.ts';

export default defineComponent({
    name: 'YandexMapScaleControl',
    props: {
        value: {
            type: Object as PropType<YMapScaleControl | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapScaleControl | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapScaleControl>[0]>,
            default: () => ({}),
        },
        index: Number,
    },
    emits: {
        'input'(item: YMapScaleControl): boolean {
            return true;
        },
        'update:modelValue'(item: YMapScaleControl): boolean {
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
        let mapChildren: YMapScaleControl | undefined;

        onMounted(async () => {
            mapChildren = await setupMapChildren({
                createFunction: () => new ymaps3.YMapScaleControl(props.settings),
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
