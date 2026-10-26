<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import { importLayersExtra } from '#core';
import type { IYandexMapTrafficLayer } from '#core';
import { setupMapChildren } from '#core';

defineOptions({ name: 'YandexMapTrafficLayer', render: () => null });

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
