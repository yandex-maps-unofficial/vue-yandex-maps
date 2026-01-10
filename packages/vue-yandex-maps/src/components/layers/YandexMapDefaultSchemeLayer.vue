<script lang="ts" setup>
import type { YMapDefaultSchemeLayer } from '@yandex/ymaps3-types';
import type { PropType, Ref } from 'vue';
import { computed, inject, onMounted } from 'vue';

import { setupMapChildren } from '../../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapDefaultSchemeLayer' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapDefaultSchemeLayer | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapDefaultSchemeLayer>[0]>,
        default: () => ({}),
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapDefaultSchemeLayer): void }>();

const hold = inject<Ref<number>>('needsToHold')!;
hold.value++;
let mapLayer: YMapDefaultSchemeLayer | undefined;

onMounted(async () => {
    mapLayer = await setupMapChildren({
        createFunction: () => new ymaps3.YMapDefaultSchemeLayer(props.settings || {}),
        settings: computed(() => props.settings),
        isLayer: true,
    });
    emit('update:modelValue', mapLayer);
    hold.value--;
});
</script>
