<template>
    <div
        ref="element"
        class="__ymap_control-button"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted, ref } from 'vue';
import type { YMapControlButton } from '@yandex/ymaps3-types';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';

export type YandexMapControlButtonSettings = Omit<ConstructorParameters<typeof YMapControlButton>[0], 'element' | 'text'>;

defineOptions({ name: 'YandexMapControlButton' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapControlButton | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<YandexMapControlButtonSettings>,
        default: () => ({}),
    },
    index: Number,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapControlButton): void }>();

defineSlots<{ default: () => any }>();

let mapChildren: YMapControlButton | undefined;
const element = ref<null | HTMLDivElement>(null);

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: () => new ymaps3.YMapControlButton({
            ...props.settings,
            element: element.value!,
        }),
        settings: computed(() => ({
            ...props.settings,
            element: element.value!,
        })),
        strictMapRoot: true,
        index: toRef(props, 'index'),
    });

    emit('update:modelValue', mapChildren);
});
</script>
