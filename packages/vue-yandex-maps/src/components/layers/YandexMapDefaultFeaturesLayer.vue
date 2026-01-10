<script lang="ts" setup>
import type { YMapDefaultFeaturesLayer } from '@yandex/ymaps3-types';
import type { PropType, Ref } from 'vue';
import { computed, inject, onMounted } from 'vue';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapDefaultFeaturesLayer' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapDefaultFeaturesLayer | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapDefaultFeaturesLayer>[0]>,
        default: () => ({}),
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapDefaultFeaturesLayer): void }>();

const hold = inject<Ref<number>>('needsToHold')!;
hold.value++;
let mapLayer: YMapDefaultFeaturesLayer | undefined;

onMounted(async () => {
    mapLayer = await setupMapChildren({
        createFunction: () => new ymaps3.YMapDefaultFeaturesLayer(props.settings || {}),
        settings: computed(() => props.settings),
        isLayer: true,
    });
    emit('update:modelValue', mapLayer);
    hold.value--;
});
</script>
