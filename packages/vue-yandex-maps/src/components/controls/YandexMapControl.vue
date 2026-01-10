<template>
    <div
        ref="element"
        class="__ymap_control"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted, ref } from 'vue';
import type { YMapControl } from '@yandex/ymaps3-types';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapControl' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapControl | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapControl>[0]>,
        default: () => ({}),
    },
    index: Number,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapControl): void }>();

defineSlots<{ default: () => any }>();

let mapChildren: YMapControl | undefined;
const element = ref<null | HTMLDivElement>(null);

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: () => new ymaps3.YMapControl(props.settings, element.value!),
        settings: computed(() => props.settings),
        strictMapRoot: true,
        index: toRef(props, 'index'),
    });
    emit('update:modelValue', mapChildren);
});
</script>
