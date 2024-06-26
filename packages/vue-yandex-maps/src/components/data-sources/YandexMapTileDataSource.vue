<script lang="ts">
import type { YMapTileDataSource } from '@yandex/ymaps3-types';
import type { PropType, Ref, SlotsType } from 'vue';
import { computed, defineComponent, inject, onMounted } from 'vue';
import { hVue2, throwException } from '../../utils/system.ts';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';

export default defineComponent({
    name: 'YandexMapTileDataSource',
    props: {
        value: {
            type: Object as PropType<YMapTileDataSource | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapTileDataSource | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapTileDataSource>[0]>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapTileDataSource): boolean {
            return true;
        },
        'update:modelValue'(item: YMapTileDataSource): boolean {
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
        let mapChildren: YMapTileDataSource | undefined;

        onMounted(async () => {
            if (!props.settings.id) {
                throwException({
                    text: 'You must specify id in YandexMapTileDataSource settings',
                });
            }

            mapChildren = await setupMapChildren({
                createFunction: () => new ymaps3.YMapTileDataSource(props.settings),
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
