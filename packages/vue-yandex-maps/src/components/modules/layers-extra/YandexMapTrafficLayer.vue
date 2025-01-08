<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';
import type { IYandexMapTrafficLayer } from '../../../namespace.ts';
import { VueYandexMaps } from '../../../namespace.ts';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';

export default defineComponent({
    name: 'YandexMapTrafficLayer',
    props: {
        value: {
            type: Object as PropType<IYandexMapTrafficLayer | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<IYandexMapTrafficLayer | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<ConstructorParameters<typeof IYandexMapTrafficLayer>[0]>,
            default: () => ({}),
        },
    },
    emits: {
        'input'(item: IYandexMapTrafficLayer): boolean {
            return true;
        },
        'update:modelValue'(item: IYandexMapTrafficLayer): boolean {
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
        let mapLayer: IYandexMapTrafficLayer | undefined;

        onMounted(async () => {
            mapLayer = await setupMapChildren({
                createFunction: layers => new layers.YMapTrafficLayer(props.settings || {}),
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
