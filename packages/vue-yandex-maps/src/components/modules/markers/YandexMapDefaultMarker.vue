<template>
    <div
        v-if="!!slots.popup"
        ref="popup"
        class="__ymap_default-marker-popup"
    >
        <slot name="popup"/>
    </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';
import type { YMapDefaultMarker, YMapDefaultMarkerProps } from '@yandex/ymaps3-default-ui-theme';
import { throwException } from '../../../utils/system.ts';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { importYmapsCDNModule } from '../../../functions';

defineOptions({ name: 'YandexMapDefaultMarker' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapDefaultMarker | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<YandexMapDefaultMarkerSettings>,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapDefaultMarker): void }>();
defineSlots<{ popup: () => unknown }>();
const slots = useSlots();

type Settings = ConstructorParameters<typeof YMapDefaultMarker>[0];
export type YandexMapDefaultMarkerSettings = Omit<Settings, 'popup'> & {
    popup?: Omit<NonNullable<YMapDefaultMarkerProps['popup']>, 'content'> & {
        content?: NonNullable<YMapDefaultMarkerProps['popup']>['content'];
    };
};

let mapChildren: YMapDefaultMarker | undefined;
const popup = ref<HTMLDivElement | null>(null);

const contentFunc = () => {
    return popup.value!;
};

const getSettings = computed<YandexMapDefaultMarkerSettings>(() => {
    const settings = { ...props.settings };

    if (settings.popup && (typeof settings.popup.content === 'undefined' || settings.popup.content === 'fromSlot') && popup.value) {
        settings.popup = {
            ...settings.popup,
            content: contentFunc,
        };
    }

    return settings;
});

onMounted(async () => {
    if (!props.settings.coordinates) {
        throwException({
            text: 'You must specify coordinates in YandexMapDefaultMarker settings',
        });
    }

    mapChildren = await setupMapChildren({
        createFunction: ({ YMapDefaultMarker: Marker }) => new Marker(getSettings.value as Settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
        settings: getSettings,
    });
    emit('update:modelValue', mapChildren);
});

watch(popup, () => {
    if (popup.value) popup.value.parentNode?.removeChild(popup.value);
});
</script>
