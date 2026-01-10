<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import { importLayersExtra } from '../../../utils/init.ts';
import type { IYandexMapTrafficLayer } from '../../../utils/init.ts';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapTrafficLayer' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<IYandexMapTrafficLayer | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof IYandexMapTrafficLayer>[0]>,
        default: () => ({}),
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: IYandexMapTrafficLayer): void }>();

let mapLayer: IYandexMapTrafficLayer | undefined;

onMounted(async () => {
    mapLayer = await setupMapChildren({
        createFunction: layers => new layers.YMapTrafficLayer(props.settings || {}),
        requiredImport: () => importLayersExtra(),
        settings: computed(() => props.settings),
    });
    emit('update:modelValue', mapLayer);
});
</script>
