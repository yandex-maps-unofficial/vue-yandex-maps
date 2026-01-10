<template>
    <div
        ref="element"
        class="__ymap_popup-marker"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted, ref } from 'vue';
import type { YMapPopupMarker } from '@yandex/ymaps3-default-ui-theme';
import { throwException } from '../../../utils/system.ts';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { importYmapsCDNModule } from '../../../functions/init.ts';

defineOptions({ name: 'YandexMapPopupMarker' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapPopupMarker | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<YandexMapPopupMarkerSettings>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapPopupMarker): void }>();

defineSlots<{ default: () => any }>();

export type YandexMapPopupMarkerSettings = Omit<ConstructorParameters<typeof YMapPopupMarker>[0], 'content'>;

let mapChildren: YMapPopupMarker | undefined;
const element = ref<null | HTMLDivElement>(null);

const contentFunc = () => {
    return element.value!;
};


const getSettings = computed<ConstructorParameters<typeof YMapPopupMarker>[0]>(() => {
    return {
        ...props.settings,
        content: contentFunc,
    };
});

onMounted(async () => {
    if (!props.settings.coordinates) {
        throwException({
            text: 'You must specify coordinates in YandexMapPopupMarker settings',
        });
    }

    mapChildren = await setupMapChildren({
        createFunction: ({ YMapPopupMarker: Marker }) => new Marker(getSettings.value),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
        settings: getSettings,
    });
    emit('update:modelValue', mapChildren);
});
</script>
