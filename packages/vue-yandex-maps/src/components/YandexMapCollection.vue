<template>
    <slot v-if="mapChildren"/>
</template>

<script lang="ts" setup>
import type { YMapCollection } from '@yandex/ymaps3-types';
import type { PropType } from 'vue';
import { onMounted, shallowRef } from 'vue';

import { provideMapRoot, setupMapChildren } from '../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapCollection' });

defineProps({
    modelValue: {
        type: Object as PropType<YMapCollection | null>,
        default: null,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapCollection | null): void }>();

defineSlots<{ default: () => any }>();

const mapChildren = shallowRef<YMapCollection | null>(null);

const mapRoot = provideMapRoot();

onMounted(async () => {
    mapChildren.value = await setupMapChildren({
        createFunction: () => new ymaps3.YMapCollection({}),
        mapRoot,
    });

    emit('update:modelValue', mapChildren.value);
});
</script>
