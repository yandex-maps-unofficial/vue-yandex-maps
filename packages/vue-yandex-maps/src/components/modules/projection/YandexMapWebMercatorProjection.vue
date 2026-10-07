<script lang="ts" setup>
import type { PropType, Ref } from 'vue';
import { inject, onMounted } from 'vue';
import type { WebMercator } from '@yandex/ymaps3-web-mercator-projection';
import type { Projection } from '@yandex/ymaps3-types/common/types';
import { setupMapChildren } from '#core';
import { importYmapsCDNModule } from '#core';

defineOptions({ name: 'YandexMapWebMercatorProjection', render: () => null });

defineProps({
    modelValue: {
        type: Object as PropType<WebMercator | null>,
        default: null,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: WebMercator): void }>();

const hold = inject<Ref<number>>('needsToHold')!;
hold.value++;
const projection = inject<Ref<null | Projection>>('projection');

onMounted(async () => {
    if (!projection) return;

    const cartesian = await setupMapChildren({
        isProjection: true,
        createFunction: ({ WebMercator: WebMercatorClass }) => new WebMercatorClass(),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-web-mercator-projection'),
    });

    projection.value = cartesian;
    emit('update:modelValue', cartesian);
    hold.value--;
});
</script>
