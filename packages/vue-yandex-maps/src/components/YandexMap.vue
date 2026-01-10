<template>
    <component
        :is="tag"
        ref="mapRef"
        class="__ymap"
        :class="{ '__ymap--grab': cursorGrab }"
        :style="{ width, height, zIndex: zIndex.toString() }"
    >
        <div
            ref="ymapContainer"
            class="__ymap_container"
        />
        <div
            v-if="mounted"
            v-show="false"
            class="__ymap_slots"
        >
            <slot/>
        </div>
    </component>
</template>

<script lang="ts" setup>
import type { PropType, WatchStopHandle } from 'vue';
import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    shallowRef,
    watch,
} from 'vue';
import type { LngLat, YMap, YMapEntity, YMapListener, YMapProps } from '@yandex/ymaps3-types';
import type { Projection } from '@yandex/ymaps3-types/common/types';
import { initYmaps } from '../functions';
import { diff } from 'deep-object-diff';
import { copy, throwException } from '../utils/system.ts';
import { waitTillMapInit } from '../utils/map.ts';
import {
    yandexMapIsLoaded,
    yandexMapLoadStatus,
    yandexMapScript,
    yandexMapSettings,
} from '../utils/init.ts';

export type YandexMapSettings = Omit<YMapProps, 'projection'>;

defineOptions({ name: 'YandexMap' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMap | null>,
        default: null,
    },
    tag: {
        type: String,
        default: 'div',
    },
    width: {
        type: String,
        default: '100%',
    },
    height: {
        type: String,
        default: '100%',
    },
    // z-index for Map Container. Without this, elements of the map will be displayed under your site's elements due to high z-index inside of them
    zIndex: {
        type: Number,
        default: 0,
    },
    /**
   * @description Settings for cart initialization.,
   *
   * You can modify this object or use map methods, such as setLocation/setBehaviors e.t.c.
   * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#map-parms
   * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#map-parms
   */
    settings: {
        type: Object as PropType<YandexMapSettings>,
        required: true,
    },
    /**
   * @description Makes settings readonly. Enable this if reactivity causes problems
   */
    readonlySettings: {
        type: Boolean,
        default: false,
    },
    /**
   * @description Always inserts actual user center or bounds (based on your input) on every location change
   * @note This prop will cause user location change on every settings update (if user did move since last time). Use it with caution.
   */
    realSettingsLocation: {
        type: Boolean,
        default: false,
    },
    /**
   * @description You can also add layers through <yandex-*> components
   *
   * Modifying this object after mount will cause no effect.
   *
   * Instead, please use map methods, such as addChild.
   * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#layers
   * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#layers
   */
    layers: {
        type: Array as PropType<YMapEntity<unknown>[]>,
        default: (() => []),
    },
    /**
   * @description Adds cursor: grab/grabbing to ymaps scheme layer
   */
    cursorGrab: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMap | null): void }>();

defineSlots<{ default: () => any }>();

const map = shallowRef<YMap | null>(null);
const mapRef = shallowRef<HTMLDivElement | null>(null);
const mapLayers = shallowRef([]);
const projection = shallowRef<null | Projection>(null);
const ymapContainer = shallowRef<HTMLDivElement | null>(null);
const mounted = shallowRef(false);
// Count of components which initialization we need to wait for
const needsToHold = ref(0);

provide('map', map);
provide('layers', mapLayers);
provide('projection', projection);
provide('needsToHold', needsToHold);

const getSettings = computed<YMapProps>(() => ({
    ...props.settings,
    projection: undefined,
}));

const init = async () => {
    if (!props.settings.location) {
        throwException({
            text: 'You must specify location in YandexMap settings',
        });
    }

    if (map.value) map.value.destroy();

    const container = ymapContainer.value;
    if (!container) return;

    const settings: YMapProps = getSettings.value;
    if (projection.value) settings.projection = projection.value;

    map.value = new ymaps3.YMap(container, settings, [
        ...mapLayers.value,
        ...props.layers,
    ]);
    emit('update:modelValue', map.value);
};

let listener: YMapListener | undefined;
let watcher: WatchStopHandle | undefined;
let cursorGrabTimeout: NodeJS.Timeout | null = null;

async function setupCursorGrab() {
    await waitTillMapInit({
        map,
        timeoutCallback: (_timeout, isDelete) => {
            if (isDelete) {
                cursorGrabTimeout = null;
            }
            else {
                cursorGrabTimeout = _timeout;
            }
        },
    }).catch(() => {
    });

    if (!map.value) return;

    if (props.cursorGrab) {
        listener = new ymaps3.YMapListener({
            onActionStart: e => {
                if (e.type === 'drag' && props.cursorGrab) mapRef.value?.classList.add('__ymap--grabbing');
            },
            onActionEnd: e => {
                if (e.type === 'drag') mapRef.value?.classList.remove('__ymap--grabbing');
            },
        });
        map.value.addChild(listener);
    }
    else if (listener) map.value.removeChild(listener);
}

let reInit = false;

watch(yandexMapLoadStatus, async val => {
    if (val === 'pending') {
        reInit = true;
        mounted.value = false;
        return;
    }
    if (val !== 'loaded' && !reInit) return;

    mounted.value = true;
    await nextTick();

    if (needsToHold.value) {
        await new Promise<void>(resolve => watch(needsToHold, () => {
            if (!needsToHold.value) resolve();
        }, {
            immediate: true,
        }));
    }

    await init();
});

onMounted(async () => {
    if (yandexMapIsLoaded.value && !yandexMapScript?.value?.parentElement) {
        yandexMapLoadStatus.value = 'pending';
        yandexMapScript.value?.remove();
        yandexMapScript.value = null;

        for (const key in window) {
            if (key.includes('ymaps3')) delete window[key];
        }
    }

    const setupWatcher = () => {
        watcher?.();

        let settings = copy(getSettings);
        watcher = watch(getSettings, val => {
            if (!map.value) return;
            const clonedSettings = copy(val);

            // Handling location change
            if (props.realSettingsLocation && clonedSettings.location) {
                if ('center' in clonedSettings.location && 'center' in settings.location) {
                    settings.location.center = map.value.center as LngLat;
                }
                else if ('bounds' in clonedSettings.location && 'bounds' in settings.location) {
                    settings.location.bounds = map.value.bounds;
                }

                if ('zoom' in clonedSettings.location && 'zoom' in settings.location) settings.location.zoom = map.value.zoom;
            }

            const settingsDiff = Object.keys(diff(settings, clonedSettings));
            if (settingsDiff.length === 0) return;

            const updatedSettings = { ...clonedSettings };
            for (const key in updatedSettings) {
                if (!settingsDiff.includes(key)) delete (updatedSettings as any)[key];
            }

            settings = clonedSettings;

            map.value?.update(updatedSettings);
        }, {
            deep: true,
        });
    };

    if (!props.readonlySettings) {
        setupWatcher();
    }

    watch(() => props.readonlySettings, val => {
        if (!val) {
            watcher?.();
        }
        else {
            setupWatcher();
        }
    });

    watch(() => props.cursorGrab, setupCursorGrab, { immediate: true });

    if (!yandexMapIsLoaded.value) {
        if (yandexMapSettings.value.initializeOn === 'onComponentMount') {
            try {
                await initYmaps();
            }
            catch (e) {
                console.error('An error occured while initializing Yandex Map with onComponentMount setting');
                console.error(e);
                return;
            }
        }
        else if (yandexMapLoadStatus.value === 'loading' || yandexMapSettings.value.initializeOn === 'onPluginInit') {
            if (yandexMapSettings.value.initializeOn === 'onPluginInit' && yandexMapLoadStatus.value !== 'loading') await nextTick();
            await initYmaps();
        }

        if (!yandexMapIsLoaded.value) {
            throwException({
                text: 'You have set up <yandex-map> component without initializing Yandex maps. Please check initializeOn setting or call initYmaps manually before registering this component.',
            });
        }
    }

    mounted.value = true;
    await nextTick();

    if (needsToHold.value) {
        await new Promise<void>(resolve => watch(needsToHold, () => {
            if (!needsToHold.value) resolve();
        }, {
            immediate: true,
        }));
    }

    await init();
});

onBeforeUnmount(() => {
    if (cursorGrabTimeout) clearTimeout(cursorGrabTimeout);
    if (map.value) map.value.destroy();

    map.value = null;
    emit('update:modelValue', map.value);
});
</script>

<style>
.__ymap {
  color: #000;
  position: relative;
}

.__ymap_container {
  width: 100%;
  height: 100%;
}

.__ymap--grab [class$="main-engine-container"] canvas {
  cursor: grab;
}

.__ymap--grabbing:focus [class$="main-engine-container"] canvas, .__ymap--grabbing:active [class$="main-engine-container"] canvas {
  cursor: grabbing;
}

.__ymap [class$="graphics-layer"] {
  text-align: left;
}
</style>
