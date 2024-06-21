<script lang="ts">
import type { YMapFeatureDataSource } from '@yandex/ymaps3-types';
import type { PropType, Ref, SlotsType } from 'vue';
import { computed, defineComponent, inject, onMounted } from 'vue';
import { hVue2, throwException } from '../../utils/system.ts';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';

export default defineComponent({
    name: 'YandexMapFeatureDataSource',
    props: {
        value: {
            type: Object as PropType<YMapFeatureDataSource | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapFeatureDataSource | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapFeatureDataSource>[0]>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapFeatureDataSource): boolean {
            return true;
        },
        'update:modelValue'(item: YMapFeatureDataSource): boolean {
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
        let mapChildren: YMapFeatureDataSource | undefined;

        onMounted(async () => {
            if (!props.settings.id) {
                throwException({
                    text: 'You must specify id in YandexMapFeatureDataSource settings',
                });
            }

            mapChildren = await setupMapChildren({
                createFunction: () => new ymaps3.YMapFeatureDataSource(props.settings),
                settings: computed(() => props.settings),
                isLayer: true,
            });
            emit('input', mapChildren);
            emit('update:modelValue', mapChildren);
            hold.value--;
        });

        return () => hVue2(slots.default?.({}));
    },
});
</script>
