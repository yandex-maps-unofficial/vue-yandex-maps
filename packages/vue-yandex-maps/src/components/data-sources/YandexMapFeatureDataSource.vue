<script lang="ts" setup>
import type { YMapFeatureDataSource } from '@yandex/ymaps3-types';
import type { PropType, Ref } from 'vue';
import { computed, inject, onMounted } from 'vue';
import { throwException } from '../../utils/system.ts';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapFeatureDataSource' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapFeatureDataSource | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapFeatureDataSource>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapFeatureDataSource): void }>();

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
    emit('update:modelValue', mapChildren);
    hold.value--;
});
</script>
