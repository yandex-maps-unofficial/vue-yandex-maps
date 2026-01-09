<script lang="ts" setup>
import { shallowRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YMapVideoOverlay } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

defineOptions({ name: 'YandexMapVideoOverlay' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapVideoOverlay | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapVideoOverlay>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapVideoOverlay): void }>();

const mapChildren = shallowRef<YMapVideoOverlay | undefined>(undefined);

onMounted(async () => {
    mapChildren.value = await setupMapChildren({
        createFunction: theme => new theme.YMapVideoOverlay(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
        settings: computed(() => props.settings),
    });
    emit('update:modelValue', mapChildren.value);
});
</script>
