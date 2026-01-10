<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import type { BehaviorEvents, DomEvents, MapEvents, YMapListener } from '@yandex/ymaps3-types';
import { setupMapChildren } from '../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapListener' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapListener | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapListener>[0]>,
        default: () => ({}),
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapListener): void }>();

export type YandexMapListenerSettings = Partial<DomEvents & MapEvents & BehaviorEvents>;

let mapListener: YMapListener | undefined;

onMounted(async () => {
    mapListener = await setupMapChildren({
        createFunction: () => new ymaps3.YMapListener(props.settings || {}),
        settings: computed(() => props.settings),
    });
    emit('update:modelValue', mapListener);
});
</script>
