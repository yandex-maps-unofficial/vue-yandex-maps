import {
  computed,
  ComputedGetter,
  ComputedRef,
  DebuggerOptions,
  getCurrentInstance,
  inject,
  isRef,
  nextTick,
  onBeforeUnmount,
  provide,
  Ref,
  ref,
  shallowRef,
  UnwrapRef,
  watch,
  WatchStopHandle,
} from 'vue';
import { YMap, YMapEntity, YMapGroupEntity } from '@yandex/ymaps3-types';
import { Projection } from '@yandex/ymaps3-types/common/types';
import { VueYandexMaps } from '../namespace.ts';

/**
 * @description Prevents memory leak on SSR when ref is called outside setup
 */
export function safeRef<T = any>(value: T): Ref<UnwrapRef<T>> {
  if (typeof window === 'undefined') {
    return {
      // @ts-ignore
      value,
      // @ts-ignore
      __v_isRef: true,
    };
  }

  return ref<T>(value);
}

/**
 * @description Prevents memory leak on SSR when computed is called outside setup
 */
export function safeComputed<T>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions,
): ComputedRef<T> {
  if (typeof window === 'undefined') {
    return {
      get value() {
        return getter();
      },
      // @ts-ignore
      __v_isRef: true,
    };
  }

  return computed<T>(getter, debugOptions);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function injectMap(): Ref<YMap | null> {
  if (!getCurrentInstance()) {
    throwException({
      text: 'injectMap must be only called on runtime.',
      isInternal: true,
    });
  }
  const map = inject<Ref<YMap | null>>('map');

  if (!map || !isRef(map)) {
    throwException({
      text: 'Was not able to inject valid map in injectMap.',
      isInternal: true,
    });
  }

  return map;
}

export function injectLayers(): Ref<any[]> {
  if (!getCurrentInstance()) {
    throwException({
      text: 'injectLayers must be only called on runtime.',
      isInternal: true,
    });
  }
  const layers = inject<Ref<any[]>>('layers');

  if (!layers || !isRef(layers)) {
    throwException({
      text: 'Was not able to inject valid layers in injectLayers.',
      isInternal: true,
    });
  }

  return layers;
}

export function waitTillYmapInit() {
  if (typeof window === 'undefined') {
    throwException({
      text: 'waitTillYmapInit cannot be called on SSR.',
      isInternal: true,
    });
  }

  return new Promise<void>((resolve, reject) => {
    if (typeof ymaps3 !== 'undefined') {
      const timeout = setTimeout(() => {
        reject(new VueYandexMaps.YandexMapException('Was not able to wait for map initialization in waitTillYmapInit. Ensure that map was initialized.'));
      }, 5000);

      watch(VueYandexMaps.isLoaded, () => {
        clearTimeout(timeout);
        if (VueYandexMaps.loadStatus.value === 'loaded') {
          resolve();
        } else {
          reject(VueYandexMaps.loadError);
        }
      }, {
        immediate: true,
      });
    } else {
      resolve();
    }
  });
}

export function waitTillMapInit(_map?: Ref<YMap | null>) {
  if (!_map && !getCurrentInstance()) {
    throwException({
      text: 'onMapInit must be only called on runtime.',
      isInternal: true,
    });
  }

  if (typeof window === 'undefined') {
    throwException({
      text: 'waitTillMapInit cannot be called on SSR.',
      isInternal: true,
    });
  }

  const map = _map || injectMap();

  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (!map.value) reject(new VueYandexMaps.YandexMapException('Was not able to wait for map initialization in waitTillMapInit.'));
    }, 5000);

    // Breaks without this
    let watcher: WatchStopHandle | undefined;

    // eslint-disable-next-line prefer-const
    watcher = watch(map, () => {
      if (map.value) {
        watcher?.();
        clearTimeout(timeout);
        resolve();
      }
    }, {
      immediate: true,
    });
  });
}

export async function setupMapChildren<T extends YMapEntity<unknown> | Projection, R extends (() => Promise<unknown>)>({
  returnOnly,
  strictMapRoot,
  requiredImport,
  createFunction,
  settings,
  isLayer,
  isMapRoot,
  mapRootRef,
}: {
  returnOnly?: boolean
  strictMapRoot?: boolean
  isMapRoot?: boolean
  mapRootRef?: Ref<YMapEntity<any>[]>
  requiredImport?: R
  createFunction: (neededImport: Awaited<ReturnType<R>>) => T
  settings?: ComputedRef<Record<string, any>>
  isLayer?: boolean
}) {
  if (!getCurrentInstance()) {
    throwException({
      text: 'setupMapChildren must be only called on runtime.',
      isInternal: true,
    });
  }

  const children = shallowRef<T | undefined>();
  const mapRoot = inject<Ref<YMapGroupEntity<any> | any[]> | null>('mapRoot', null);
  const initPromises = inject<Ref<PromiseLike<any>[]> | null>('mapRootInitPromises', null);
  let childrenPromises;
  const map = injectMap();
  const layers = injectLayers();

  if (isMapRoot) {
    provide('mapRoot', mapRootRef || children);

    childrenPromises = shallowRef([]);
    provide('mapRootInitPromises', childrenPromises);
  }

  if (!returnOnly) {
    onBeforeUnmount(() => {
      if (children.value && !('toWorldCoordinates' in children.value)) {
        if (typeof mapRoot?.value === 'object' && Array.isArray(mapRoot.value)) {
          mapRoot.value = mapRoot.value.filter((x) => x !== children.value);
        } else {
          (mapRoot?.value || map.value)?.removeChild(children.value);
        }
      }
    });
  }

  if (settings) {
    watch(settings, (value) => {
      if (children.value && 'update' in children.value) children.value.update(value ?? {});
    }, { deep: true });
  }

  if (!isLayer) {
    await waitTillMapInit();
    if (!map.value) {
      throwException({
        text: 'map is undefined in setupMapChildren.',
        isInternal: true,
      });
    }
  } else {
    await waitTillYmapInit();
  }

  if (strictMapRoot) {
    if (!mapRoot?.value) await nextTick();
    if (!mapRoot?.value) {
      throwException({
        text: 'mapRoot is undefined in setupMapChildren.',
        isInternal: true,
      });
    }
  }

  if (isMapRoot) {
    await nextTick();
    await Promise.all(childrenPromises?.value || []);
  }

  let importData;

  if (requiredImport) {
    const importPromise = requiredImport();
    if (initPromises?.value) initPromises.value.push(Promise.resolve(importPromise));
    importData = await importPromise;
  }

  children.value = createFunction(importData as Awaited<ReturnType<R>>);

  if (!returnOnly && map.value && !('toWorldCoordinates' in children.value)) {
    if (typeof mapRoot?.value === 'object' && Array.isArray(mapRoot.value)) {
      mapRoot.value = [
        ...mapRoot.value,
        children.value,
      ];
    } else {
      (mapRoot?.value || map.value).addChild(children.value);
    }
  } else if (isLayer) {
    layers.value.push(children.value);
  }

  return children.value;
}

export function isDev() {
  // @ts-expect-error
  return typeof process !== 'undefined' && (process.env?.NODE_ENV === 'development' || process.dev);
}

export function throwException({
  text,
  isInternal,
}: {
  text: string,
  isInternal?: boolean
}): never {
  if (isInternal) {
    text += ' This is likely Vue Yandex Maps internal bug.';

    if (isDev()) {
      text += ' You can report this bug here: https://github.com/PNKBizz/vue-yandex-maps/issues/new/choose';
    }
  }

  throw new VueYandexMaps.YandexMapException(text);
}
