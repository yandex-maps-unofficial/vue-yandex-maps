<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { setupMapChildren } from '#core';
import type { YMapContextMenuItem } from '@yandex/ymaps3-context-menu';
import { importYmapsCDNModule } from '#core';

defineOptions({ name: 'YandexMapContextMenuItem', render: () => null });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapContextMenuItem | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapContextMenuItem>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapContextMenuItem): void }>();

let mapChildren: YMapContextMenuItem | undefined;

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: controls => new controls.YMapContextMenuItem(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-context-menu'),
        settings: computed(() => props.settings),
        strictMapRoot: true,
    });
    emit('update:modelValue', mapChildren);
});
</script>
