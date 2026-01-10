<template>
    <div
        v-bind="rootProps.root"
        ref="element"
        class="__ymap_marker"
    >
        <div v-bind="rootProps.children">
            <slot/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { YMapMarker } from '@yandex/ymaps3-types';
import type { PropType } from 'vue';
import { computed, onMounted, ref, onUpdated } from 'vue';
import { throwException } from '../utils/system.ts';
import { setupMapChildren } from '../utils/setupMapChildren.ts';
import { getMarkerContainerProps } from '../utils/marker.ts';

import type { YandexMapMarkerPosition } from '../types/marker.ts';

defineOptions({ name: 'YandexMapMarker' });

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

defineSlots<{ default: () => any }>();

let mapChildren: YMapMarker | undefined;

const element = ref<null | HTMLDivElement>(null);

function clearElement() {
    if (!element.value?.parentElement?.closest('ymaps')) element.value?.remove();
}

onMounted(async () => {
    if (!props.settings.coordinates) {
        throwException({
            text: 'You must specify coordinates in YandexMapMarker settings',
        });
    }

    mapChildren = await setupMapChildren({
        settings: computed(() => props.settings),
        createFunction: () => new ymaps3.YMapMarker(props.settings, element.value!),
    });
    clearElement();
    emit('update:modelValue', mapChildren);
});

let mapParent: HTMLElement | undefined = undefined;

onUpdated(() => {
    if (!mapParent && element.value?.parentElement?.closest('ymaps')) mapParent = element.value.parentElement;
    else if (mapParent && element.value && !element.value?.parentElement?.closest('ymaps')) mapParent.appendChild(element.value);
    clearElement();
});

const rootProps = computed(() => getMarkerContainerProps({
    position: props.position,
    containerAttrs: props.containerAttrs,
    wrapperAttrs: props.wrapperAttrs,
    zeroSizes: props.zeroSizes,
}));
</script>
