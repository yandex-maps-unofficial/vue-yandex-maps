<script lang="ts" setup>
import type { YMapFeature } from '@yandex/ymaps3-types';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import { throwException } from '../utils/system.ts';
import { setupMapChildren } from '../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapFeature' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapFeature | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapFeature>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapFeature | null): void }>();

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
    emit('update:modelValue', mapChildren);
});
</script>
