<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YMapResizer } from '@yandex/ymaps3-resizer';
import { importYmapsCDNModule } from '../../../functions/init.ts';

defineOptions({ name: 'YandexMapResizer' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapResizer | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapResizer>[0]>,
        default: () => ({}),
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapResizer): void }>();

let mapChildren: YMapResizer | undefined;

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: controls => new controls.YMapResizer(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-resizer'),
        settings: computed(() => props.settings),
    });
    emit('update:modelValue', mapChildren);
});
</script>
