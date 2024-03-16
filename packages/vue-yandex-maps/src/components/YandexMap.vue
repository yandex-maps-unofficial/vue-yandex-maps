<script lang="ts">
import type { PropType, SlotsType, WatchStopHandle } from 'vue';
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  watch,
} from 'vue';
import type {
  LngLat, YMap, YMapEntity, YMapListener, YMapProps,
} from '@yandex/ymaps3-types';
import type { Projection } from '@yandex/ymaps3-types/common/types';
import { initYmaps } from '../composables/init.ts';
import { VueYandexMaps } from '../namespace.ts';
import { diff } from 'deep-object-diff';
import { copy, throwException } from '../composables/utils/system.ts';
import { waitTillMapInit } from '../composables/utils/map.ts';

export type YandexMapSettings = Omit<YMapProps, 'projection'>

export default defineComponent({
  name: 'YandexMap',
  props: {
    modelValue: {
      type: Object as PropType<YMap | null>,
      default: null,
    },
    value: {
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
  },
  /**
   * @description Other events are NOT available. You can listen to events via layers prop, addChildren prop or by adding <ymap-listener> as children.
   * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/events.html
   * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/events.html
   */
  emits: {
    'input'(map: YMap | null): boolean {
      return !map || typeof ymaps3 === 'undefined' || map instanceof ymaps3.YMap;
    },
    'update:modelValue'(map: YMap | null): boolean {
      return !map || typeof ymaps3 === 'undefined' || map instanceof ymaps3.YMap;
    },
  },
  slots: Object as SlotsType<{
    default: {},
  }>,
  setup(props, {
    slots,
    emit,
  }) {
    const map = shallowRef<YMap | null>(null);
    const mapRef = shallowRef<HTMLDivElement | null>(null);
    const layers = shallowRef([]);
    const projection = shallowRef<null | Projection>(null);
    const ymapContainer = shallowRef<HTMLDivElement | null>(null);
    const mounted = shallowRef(false);
    // Count of components which initialization we need to wait for
    const needsToHold = ref(0);

    provide('map', map);
    provide('layers', layers);
    provide('projection', projection);
    provide('needsToHold', needsToHold);
    emit('input', map.value);
    emit('update:modelValue', map.value);

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
        ...layers.value,
        ...props.layers,
      ]);
      emit('input', map.value);
      emit('update:modelValue', map.value);
    };

    onMounted(async () => {
      let listener: YMapListener | undefined;
      let watcher: WatchStopHandle | undefined;
      let cursorGrabTimeout: NodeJS.Timeout | null = null;

      onBeforeUnmount(() => {
        if (cursorGrabTimeout) clearTimeout(cursorGrabTimeout);
      });

      const setupWatcher = () => {
        watcher?.();

        let settings = copy(getSettings);
        watcher = watch(getSettings, (val) => {
          if (!map.value) return;
          const clonedSettings = copy(val);

          // Handling location change
          if (props.realSettingsLocation && clonedSettings.location) {
            if ('center' in clonedSettings.location && 'center' in settings.location) {
              settings.location.center = map.value.center as LngLat;
            } else if ('bounds' in clonedSettings.location && 'bounds' in settings.location) {
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

      watch(() => props.readonlySettings, (val) => {
        if (!val) {
          watcher?.();
        } else {
          setupWatcher();
        }
      });

      watch(() => props.cursorGrab, async (val) => {
        await waitTillMapInit({
          map,
          timeoutCallback: (_timeout, isDelete) => {
            if (isDelete) cursorGrabTimeout = null;
            else cursorGrabTimeout = _timeout;
          },
        }).catch(() => {});

        const eventListener = (event: MouseEvent) => {
          const target = event.target as HTMLDivElement;

          // Just in case something else is triggered
          if (!target || !('classList' in target)) return;

          // Closest can be undefined in IE. Not sure if anybody uses it but just in case
          if (target.classList.contains('ymaps3x0--button') || target.closest?.('.ymaps3x0--button')) event.preventDefault();
        };

        watch(ymapContainer, (container) => {
          if (!container) return;

          // If it suddenly had that and Vue double-triggered ref
          container.removeEventListener('click', eventListener, { capture: true });
          container.addEventListener('click', eventListener, { capture: true });
        }, {
          immediate: true,
        });

        if (!map.value) return;

        if (val) {
          listener = new ymaps3.YMapListener({
            onActionStart: (e) => {
              if (e.type === 'drag' && props.cursorGrab) mapRef.value?.classList.add('__ymap--grabbing');
            },
            onActionEnd: (e) => {
              if (e.type === 'drag') mapRef.value?.classList.remove('__ymap--grabbing');
            },
          });
          map.value.addChild(listener);
        } else if (listener) map.value.removeChild(listener);
      }, { immediate: true });

      if (!VueYandexMaps.isLoaded.value) {
        if (VueYandexMaps.settings.value.initializeOn === 'onComponentMount') {
          try {
            await initYmaps();
          } catch (e) {
            console.error('An error occured while initializing Yandex Map with onComponentMount setting');
            console.error(e);
            return;
          }
        } else if (VueYandexMaps.loadStatus.value === 'loading' || VueYandexMaps.settings.value.initializeOn === 'onPluginInit') {
          if (VueYandexMaps.settings.value.initializeOn === 'onPluginInit' && VueYandexMaps.loadStatus.value !== 'loading') await nextTick();
          await initYmaps();
        }

        if (!VueYandexMaps.isLoaded.value) {
          throwException({
            text: 'You have set up <yandex-map> component without initializing Yandex maps. Please check initializeOn setting or call initYmaps manually before registering this component.',
          });
        }
      }

      mounted.value = true;
      await nextTick();

      if (needsToHold.value) {
        await new Promise<void>((resolve) => watch(needsToHold, () => {
          if (!needsToHold.value) resolve();
        }, {
          immediate: true,
        }));
      }

      await init();
    });

    onBeforeUnmount(() => {
      map.value = null;
      emit('input', map.value);
      emit('update:modelValue', map.value);
    });

    return () => {
      const mapNodeProps = {
        class: [
          '__ymap',
          {
            '__ymap--grab': props.cursorGrab,
          },
        ],
        ref: mapRef,
        style: {
          width: props.width,
          height: props.height,
          'z-index': props.zIndex.toString(),
        },
      };

      const containerNode = h('div', {
        class: '__ymap_container',
        ref: ymapContainer,
      });

      const slotsNodeProps = {
        class: '__ymap_slots',
        style: { display: 'none' },
      };

      if (!mounted.value) return h(props.tag, mapNodeProps, [containerNode, h('div', slotsNodeProps)]);

      return h(props.tag, mapNodeProps, [
        containerNode,
        h('div', slotsNodeProps, slots.default?.({})),
      ]);
    };
  },
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

.__ymap_slots {
  display: none;
}

.__ymap--grab [class$="main-engine-container"] canvas {
  cursor: grab;
}

.__ymap--grabbing:focus [class$="main-engine-container"] canvas, .__ymap--grabbing:active [class$="main-engine-container"] canvas {
  cursor: grabbing;
}
</style>
