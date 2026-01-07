<template>
    <slot v-if="mapChildren"/>
</template>

<script lang="ts" setup>
import type { YMapControls } from '@yandex/ymaps3-types';
import type { PropType, Ref } from 'vue';
import { computed, onMounted, shallowRef } from 'vue';
import { throwException } from '../../utils/system.ts';
import { provideMapRoot, setupMapChildren } from '../../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapControls' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapControls | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapControls>[0]>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapControls): void }>();

defineSlots<{ default: () => any }>();

const mapChildren: Ref<YMapControls | null> = shallowRef(null);

const mapRoot = provideMapRoot();

onMounted(async () => {
    if (!props.settings.position) {
        throwException({
            text: 'You must specify position in YandexMapControls settings',
        });
    }

    mapChildren.value = await setupMapChildren({
        createFunction: () => new ymaps3.YMapControls(props.settings),
        mapRoot,
        settings: computed(() => props.settings),
    });

    emit('update:modelValue', mapChildren.value);
});
</script>
