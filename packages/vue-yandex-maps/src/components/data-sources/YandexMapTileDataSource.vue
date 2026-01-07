<script lang="ts" setup>
import type { YMapTileDataSource } from '@yandex/ymaps3-types';
import type { PropType, Ref } from 'vue';
import { computed, inject, onMounted } from 'vue';
import { throwException } from '../../utils/system.ts';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapTileDataSource' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapTileDataSource | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapTileDataSource>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapTileDataSource): void }>();

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
    emit('update:modelValue', mapChildren);
    hold.value--;
});
</script>
