<template>
    <div
        v-if="!!slots.popup"
        ref="popup"
        class="old-marker-popup"
    >
        <slot
            :close="closeFunc"
            name="popup"
        />
    </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';
import type { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';
import type { DefaultMarkerCustomProps } from '@yandex/ymaps3-types/packages/markers/YMapDefaultMarker';
import { setupMapChildren } from 'vue-yandex-maps';

type Settings = ConstructorParameters<typeof YMapDefaultMarker>[0];
export type YandexMapOldDefaultMarkerSettings = Omit<Settings, 'popup'> & {
    popup?: Omit<NonNullable<DefaultMarkerCustomProps['popup']>, 'content'> & {
        content?: NonNullable<DefaultMarkerCustomProps['popup']>['content'];
    };
};

defineOptions({ name: 'YandexMapOldDefaultMarker' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapDefaultMarker | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<YandexMapOldDefaultMarkerSettings>,
        default: () => ({}),
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapDefaultMarker): void }>();

defineSlots<{ popup: (settings: { close: () => void }) => unknown }>();
const slots = useSlots();

let mapChildren: YMapDefaultMarker | undefined;
const popup = ref<HTMLDivElement | null>(null);
const closeFunc = ref<() => void>(() => {
});

const contentFunc = (close: () => void) => {
    closeFunc.value = close;
    return popup.value!;
};

const getSettings = computed<YandexMapOldDefaultMarkerSettings>(() => {
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
        throw new Error('You must specify coordinates in YandexMapOldDefaultMarker settings');
    }

    mapChildren = await setupMapChildren({
        createFunction: ({ YMapDefaultMarker: Marker }) => new Marker(getSettings.value as Settings),
        requiredImport: () => ymaps3.import('@yandex/ymaps3-markers@0.0.1'),
        settings: getSettings,
    });
    emit('update:modelValue', mapChildren);
});

watch(popup, () => {
    if (popup.value) popup.value.parentNode?.removeChild(popup.value);
});
</script>
