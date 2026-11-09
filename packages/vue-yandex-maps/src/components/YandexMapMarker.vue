<template>
    <teleport
        v-if="markerHost"
        :to="markerHost.element"
    >
        <div v-bind="rootProps.children">
            <slot/>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import type { YMapMarker } from '@yandex/ymaps3-types';
import type { PropType } from 'vue';
import { computed, onMounted, onUnmounted, useAttrs, watchEffect } from 'vue';
import { createMarkerContainer, getMarkerContainerProps, setupMapChildren, throwException } from '#core';
import type { YandexMapMarkerPosition } from '../types/marker.ts';

defineOptions({ name: 'YandexMapMarker', inheritAttrs: false });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapMarker | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapMarker>[0]>,
        required: true,
    },
    /**
     * @description Sets translate(%, %) to marker to align it properly.
     *
     * If you want to make aligment to be like Yandex Maps 2.0, set this property to "top left-center".
     * @default default (as goes in Yandex by default)
     */
    position: {
        type: String as PropType<YandexMapMarkerPosition>,
    },
    /**
     * @description Allows you to add any attributes to <div class="__ymap-marker"> container.
     *
     * Important: to pass styles, you must use object-style prop instead of string.
     */
    containerAttrs: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({}),
    },
    /**
     * @description Allows you to add any attributes to <div class="__ymap-marker_wrapper"> container.
     *
     * Important: to pass styles, you must use object-style prop instead of string.
     */
    wrapperAttrs: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({}),
    },
    /**
     * @description Will add width and height: 0 to container.
     *
     * Null enables default behavior, false disables it completely (even if position is specified).
     *
     * @default true if position is specified, false otherwise
     */
    zeroSizes: {
        type: Boolean as PropType<boolean | null>,
        default: null,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapMarker): void }>();
defineSlots<{ default: (props: {}) => any }>();

const attrs = useAttrs();
// Yandex owns this container's position; Vue owns only the teleported content.
const markerHost = createMarkerContainer();

const rootProps = computed(() => getMarkerContainerProps({
    position: props.position,
    containerAttrs: props.containerAttrs,
    wrapperAttrs: props.wrapperAttrs,
    zeroSizes: props.zeroSizes,
}));

watchEffect(() => {
    // Read a key even when attrs is empty so Vue tracks future attrs changes.
    const className = attrs.class;
    markerHost?.update({
        ...rootProps.value.root,
        ...attrs,
        class: 'class' in attrs ? className : rootProps.value.root.class,
    });
});
onUnmounted(() => markerHost?.destroy());

onMounted(async () => {
    if (!props.settings.coordinates) {
        throwException({ text: 'You must specify coordinates in YandexMapMarker settings' });
    }

    const marker = await setupMapChildren({
        settings: computed(() => props.settings),
        createFunction: () => new ymaps3.YMapMarker(props.settings, markerHost!.element),
    });
    emit('update:modelValue', marker);
});
</script>
