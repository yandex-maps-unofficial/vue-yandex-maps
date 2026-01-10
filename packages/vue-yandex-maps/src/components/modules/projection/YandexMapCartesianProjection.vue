<script lang="ts" setup>
import type { PropType, Ref } from 'vue';
import { inject, onMounted } from 'vue';
import type { Cartesian } from '@yandex/ymaps3-cartesian-projection';
import type { Projection } from '@yandex/ymaps3-types/common/types';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { importYmapsCDNModule } from '../../../functions';

defineOptions({ name: 'YandexMapCartesianProjection' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<Cartesian | null>,
        default: null,
    },
    bounds: {
        type: Array as unknown as PropType<ConstructorParameters<typeof Cartesian>[0]>,
        required: true,
    },
    cycled: {
        type: Array as unknown as PropType<ConstructorParameters<typeof Cartesian>[1]>,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: Cartesian): void }>();

const hold = inject<Ref<number>>('needsToHold')!;
hold.value++;
const projection = inject<Ref<null | Projection>>('projection');

onMounted(async () => {
    if (!projection) return;

    const cartesian = await setupMapChildren({
        isProjection: true,
        createFunction: ({ Cartesian: CartesianClass }) => new CartesianClass(props.bounds, props.cycled),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-cartesian-projection'),
    });

    projection.value = cartesian;
    emit('update:modelValue', cartesian);
    hold.value--;
});
</script>
