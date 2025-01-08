<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';
import type { IYandexMapTrafficEventsLayer } from '../../../namespace.ts';
import { VueYandexMaps } from '../../../namespace.ts';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';

export default defineComponent({
    name: 'YandexMapTrafficEventsLayer',
    props: {
        value: {
            type: Object as PropType<IYandexMapTrafficEventsLayer | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<IYandexMapTrafficEventsLayer | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof IYandexMapTrafficEventsLayer>[0]>,
            default: () => ({}),
        },
    },
    emits: {
        'input'(item: IYandexMapTrafficEventsLayer): boolean {
            return true;
        },
        'update:modelValue'(item: IYandexMapTrafficEventsLayer): boolean {
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
        let mapLayer: IYandexMapTrafficEventsLayer | undefined;

        onMounted(async () => {
            mapLayer = await setupMapChildren({
                createFunction: layers => new layers.YMapTrafficEventsLayer(props.settings || {}),
                requiredImport: () => VueYandexMaps.importLayersExtra(),
                settings: computed(() => props.settings),
            });
            emit('input', mapLayer);
            emit('update:modelValue', mapLayer);
        });

        return () => slots.default?.({});
    },
});
</script>
