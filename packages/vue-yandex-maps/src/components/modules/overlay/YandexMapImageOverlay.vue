<script lang="ts" setup>
import { shallowRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YMapImageOverlay } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

defineOptions({ name: 'YandexMapImageOverlay' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapImageOverlay | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapImageOverlay>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapImageOverlay): void }>();

const mapChildren = shallowRef<YMapImageOverlay | undefined>(undefined);

onMounted(async () => {
    mapChildren.value = await setupMapChildren({
        createFunction: theme => new theme.YMapImageOverlay(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
        settings: computed(() => props.settings),
    });
    emit('update:modelValue', mapChildren.value);
});
</script>
