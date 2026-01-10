<script lang="ts" setup>
import type { YMapLayer } from '@yandex/ymaps3-types';
import type { PropType, Ref } from 'vue';
import { computed, inject, onMounted } from 'vue';
import { throwException } from '../../utils/system.ts';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapLayer' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapLayer | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapLayer>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapLayer): void }>();

const hold = inject<Ref<number>>('needsToHold')!;
hold.value++;
let mapLayer: YMapLayer | undefined;

onMounted(async () => {
    if (!props.settings.type) {
        throwException({
            text: 'You must specify type in YandexMapLayer settings',
        });
    }

    mapLayer = await setupMapChildren({
        createFunction: () => new ymaps3.YMapLayer(props.settings || {}),
        settings: computed(() => props.settings),
        isLayer: true,
    });

    emit('update:modelValue', mapLayer);
    hold.value--;
});
</script>
