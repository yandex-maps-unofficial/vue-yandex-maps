<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import type { IYandexMapTrafficEventsLayer } from '../../../namespace.ts';
import { VueYandexMaps } from '../../../namespace.ts';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapTrafficEventsLayer' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<IYandexMapTrafficEventsLayer | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof IYandexMapTrafficEventsLayer>[0]>,
        default: () => ({}),
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: IYandexMapTrafficEventsLayer): void }>();

let mapLayer: IYandexMapTrafficEventsLayer | undefined;

onMounted(async () => {
    mapLayer = await setupMapChildren({
        createFunction: layers => new layers.YMapTrafficEventsLayer(props.settings || {}),
        requiredImport: () => VueYandexMaps.importLayersExtra(),
        settings: computed(() => props.settings),
    });
    emit('update:modelValue', mapLayer);
});
</script>
