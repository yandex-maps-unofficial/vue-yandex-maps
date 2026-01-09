<template>
    <div
        ref="content"
        class="__ymap_drawer"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted, ref, shallowRef } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YMapDrawerControl } from '@yandex/ymaps3-drawer-control';
import { importYmapsCDNModule } from '../../../functions/init.ts';

defineOptions({ name: 'YandexMapDrawerControl' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapDrawerControl | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<Omit<ConstructorParameters<typeof YMapDrawerControl>[0], 'content'>>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapDrawerControl): void }>();

defineSlots<{ default: () => any }>();

const content = ref<HTMLDivElement | null>(null);
const mapChildren = shallowRef<YMapDrawerControl | undefined>(undefined);

const contentFunc = () => {
    return content.value!;
};

const getSettings = computed<ConstructorParameters<typeof YMapDrawerControl>[0]>(() => {
    return { ...props.settings, content: contentFunc };
});

onMounted(async () => {
    mapChildren.value = await setupMapChildren({
        createFunction: controls => new controls.YMapDrawerControl(getSettings.value),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-drawer-control'),
        settings: getSettings,
    });
    emit('update:modelValue', mapChildren.value);
});
</script>
