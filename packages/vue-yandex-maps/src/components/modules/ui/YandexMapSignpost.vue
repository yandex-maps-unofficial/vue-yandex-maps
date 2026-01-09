<script lang="ts" setup>
import { shallowRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YMapSignpost } from '@yandex/ymaps3-signpost';
import { importYmapsCDNModule } from '../../../functions/init.ts';

defineOptions({ name: 'YandexMapSignpost' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapSignpost | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapSignpost>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapSignpost): void }>();

const mapChildren = shallowRef<YMapSignpost | undefined>(undefined);

onMounted(async () => {
    mapChildren.value = await setupMapChildren({
        createFunction: controls => new controls.YMapSignpost(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-signpost'),
        settings: computed(() => props.settings),
    });
    emit('update:modelValue', mapChildren.value);
});
</script>
