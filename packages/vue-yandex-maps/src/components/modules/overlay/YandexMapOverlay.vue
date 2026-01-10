<template>
    <div
        ref="element"
        class="__ymap_overlay"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, watch } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YMapOverlay } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

defineOptions({ name: 'YandexMapOverlay' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapOverlay | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<YandexMapOverlayCustomProps>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapOverlay): void }>();

defineSlots<{ default: () => any }>();

export type YandexMapOverlayCustomProps = Omit<ConstructorParameters<typeof YMapOverlay>[0], 'htmlElement'>;

const mapChildren = shallowRef<YMapOverlay | undefined>(undefined);
const element = ref<HTMLDivElement>(document.createElement('div'));

watch(element, (_, oldVal) => {
    oldVal?.remove();
});

const getSettings = computed<ConstructorParameters<typeof YMapOverlay>[0]>(() => {
    return {
        ...props.settings,
        htmlElement: element.value,
    };
});

onMounted(async () => {
    mapChildren.value = await setupMapChildren({
        createFunction: theme => new theme.YMapOverlay(getSettings.value),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
        settings: getSettings,
    });
    emit('update:modelValue', mapChildren.value);
});
</script>
