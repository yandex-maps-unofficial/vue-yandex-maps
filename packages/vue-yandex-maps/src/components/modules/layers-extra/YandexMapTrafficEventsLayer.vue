<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import { importLayersExtra } from '../../../utils/init.ts';
import type { IYandexMapTrafficEventsLayer } from '../../../utils/init.ts';
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
        requiredImport: () => importLayersExtra(),
        settings: computed(() => props.settings),
    });
    emit('update:modelValue', mapLayer);
});
</script>
