<script lang="ts">
import type { YMapFeature } from '@yandex/ymaps3-types';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';
import { hVue2, throwException } from '../utils/system.ts';
import { setupMapChildren } from '../utils/setupMapChildren.ts';

export default defineComponent({
    name: 'YandexMapFeature',
    props: {
        value: {
            type: Object as PropType<YMapFeature | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapFeature | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof YMapFeature>[0]>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapFeature): boolean {
            return true;
        },
        'update:modelValue'(item: YMapFeature): boolean {
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
        let mapChildren: YMapFeature | undefined;

        onMounted(async () => {
            if (!props.settings.geometry) {
                throwException({
                    text: 'You must specify geometry in YandexMapFeature settings',
                });
            }

            mapChildren = await setupMapChildren({
                createFunction: () => new ymaps3.YMapFeature(props.settings),
                settings: computed(() => props.settings),
            });
            emit('input', mapChildren);
            emit('update:modelValue', mapChildren);
        });

        return () => hVue2(slots.default?.({}));
    },
});
</script>
