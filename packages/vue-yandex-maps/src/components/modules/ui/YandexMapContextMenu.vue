<template>
    <slot v-if="mapChildren"/>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { provideMapRoot, setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YMapContextMenu } from '@yandex/ymaps3-context-menu';
import { importYmapsCDNModule } from '../../../functions/init.ts';

defineOptions({ name: 'YandexMapContextMenu' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapContextMenu | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapContextMenu>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapContextMenu): void }>();

defineSlots<{ default: () => any }>();

const mapChildren = shallowRef<YMapContextMenu | undefined>(undefined);
const mapRoot = provideMapRoot();

onMounted(async () => {
    mapChildren.value = await setupMapChildren({
        createFunction: controls => new controls.YMapContextMenu(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-context-menu'),
        settings: computed(() => props.settings),
        mapRoot,
    });
    emit('update:modelValue', mapChildren.value);
});
</script>
