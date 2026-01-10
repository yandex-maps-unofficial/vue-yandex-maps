<script lang="ts" setup>
import { shallowRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YMapSpinner } from '@yandex/ymaps3-spinner';
import { importYmapsCDNModule } from '../../../functions/init.ts';

defineOptions({ name: 'YandexMapSpinner' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapSpinner | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapSpinner>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapSpinner): void }>();

const mapChildren = shallowRef<YMapSpinner | undefined>(undefined);

onMounted(async () => {
    mapChildren.value = await setupMapChildren({
        createFunction: controls => new controls.YMapSpinner(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-spinner'),
        settings: computed(() => props.settings),
    });
    emit('update:modelValue', mapChildren.value);
});
</script>
