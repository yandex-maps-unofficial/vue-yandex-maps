import type {
  ComputedGetter, ComputedRef, DebuggerOptions, Ref, UnwrapRef, WatchStopHandle,
} from 'vue';
import {
  computed,
  getCurrentInstance,
  inject,
  isRef,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  shallowRef,
  toRaw,
  watch,
} from 'vue';
import type { YMap, YMapEntity, YMapGroupEntity } from '@yandex/ymaps3-types';
import type { Projection } from '@yandex/ymaps3-types/common/types';
import { VueYandexMaps } from '../namespace.ts';
import { diff } from 'deep-object-diff';

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

export function deleteMapChild({
  children,
  isMercator,
  root,
}: {
  children: YMapEntity<unknown> | Projection,
  isMercator?: boolean,
  root: Ref<YMap | YMapGroupEntity<any> | any[] | null>
}) {
  if (!root) {
    throwException({
      text: 'Failed to execute deleteMapChild due to destroyed root',
      isInternal: true,
    });
  }

  if (children && !isMercator) {
    if (typeof root?.value === 'object' && Array.isArray(root.value)) {
      root.value = root.value.filter((x) => x !== children);
    } else {
      root.value?.removeChild(children as YMapEntity<unknown>);
    }
  } else if (root.value && children && isMercator && 'update' in root.value) {
    root.value.update({
      projection: undefined,
    });
  }
}

function excludeKeys(item: Record<string, any>, ignoreKeys: string[]) {
  for (const [key, value] of Object.entries(item)) {
    if (ignoreKeys.includes(key)) delete item[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      excludeKeys(value, ignoreKeys);
      if (!Object.keys(value).length) delete item[key];
    }
  }
}

function copy<T>(target: T): T {
  if (Array.isArray(target)) return target.map((i) => copy(i)) as T;
  if (!target || typeof target !== 'object' || (target?.constructor !== undefined && target?.constructor !== Object)) return target;
  return Object.keys(target)
    .reduce((carry, key) => {
      const val = (target as any)[key];
      (carry as any)[key] = copy(val);
      return carry;
    }, {} as T);
}

export async function setupMapChildren<T extends YMapEntity<unknown> | Projection, R extends (() => Promise<unknown>)>({
  returnOnly,
  willDeleteByHand,
  strictMapRoot,
  requiredImport,
  createFunction,
  settings,
  settingsUpdateIgnoreKeys,
  isLayer,
  isMercator,
  isMapRoot,
  mapRootRef,
  duplicateInit,
}: {
  /**
   * @description Prevents duplicate provide injections
   */
  duplicateInit?: boolean

  /**
   * @description Disables onBeforeUnmount hook
   */
  willDeleteByHand?: boolean

  /**
   * @description Disables children-to-root injection
   */
  returnOnly?: boolean

  /**
   * @description Requires map root to be present (map root can't be YMap in this case)
   */
  strictMapRoot?: boolean

  /**
   * @description Sets injected component to be root of children components (array.push/.addChild will be called)
   */
  isMapRoot?: boolean

  /**
   * @description Allows to use array instead of addChild mapRoot injection
   */
  mapRootRef?: Ref<YMapEntity<any>[]>

  /**
   * @description Promise to call before calling createFunction. Executes only after Yandex script has been injected
   */
  requiredImport?: R

  /**
   * @description Function that returns Yandex entity
   */
  createFunction: (neededImport: Awaited<ReturnType<R>>) => T

  /**
   * @description Entity reactive settings. If passed, will be auto-watched
   */
  settings?: ComputedRef<Record<string, any>>
  /**
   * @description Allows to not-update specific keys inside of settings watch
   */
  settingsUpdateIgnoreKeys?: string[] | ComputedRef<string[]>

  /**
   * @description Specifies that entity is a layer children. Will be injected to layer ref instead of root and will skip YandexMap initialization
   */
  isLayer?: boolean
  /**
   * @description Specifies that entity is a layer children. Will be injected to layer ref instead of root and will skip YandexMap initialization, and will be added in special way to YandexMap
   */
  isMercator?: boolean
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

  if (isMapRoot && !duplicateInit) {
    provide('mapRoot', mapRootRef || children);

    childrenPromises = shallowRef([]);
    provide('mapRootInitPromises', childrenPromises);
  }

  if (!returnOnly && !willDeleteByHand) {
    onBeforeUnmount(() => {
      if (children.value) {
        deleteMapChild({
          children: children.value,
          isMercator,
          root: mapRoot?.value ? mapRoot : map,
        });
      }
    });
  }

  if (settings) {
    let lastSettings = copy(toRaw(settings.value));

    watch(settings, (value) => {
      if (!value) return;

      const settingsDiff = Object.keys(diff(lastSettings, value));
      if (settingsDiff.length === 0) return;

      const updatedSettings = { ...value };
      for (const key in updatedSettings) {
        if (!settingsDiff.includes(key)) delete (updatedSettings as any)[key];
      }

      const ignoreKeys = settingsUpdateIgnoreKeys && (isRef(settingsUpdateIgnoreKeys) ? settingsUpdateIgnoreKeys.value : settingsUpdateIgnoreKeys);
      if (ignoreKeys) excludeKeys(updatedSettings, ignoreKeys);

      if (Object.keys(updatedSettings).length === 0) return;

      lastSettings = toRaw(copy(value));

      if (children.value && 'update' in children.value) children.value.update(updatedSettings);
    }, { deep: true });
  }

  if (!isLayer && !isMercator) {
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

  if (!returnOnly && map.value && !isMercator) {
    if (initPromises?.value) {
      await Promise.all(initPromises.value);
      if (!requiredImport) await nextTick();
    }

    if (typeof mapRoot?.value === 'object' && Array.isArray(mapRoot.value)) {
      mapRoot.value = [
        ...mapRoot.value,
        children.value,
      ];
    } else {
      (mapRoot?.value || map.value).addChild(children.value as YMapEntity<unknown>);
    }
  } else if (isLayer) {
    layers.value.push(children.value);
  } else if (isMercator && map.value) {
    map.value.update({
      projection: children.value as unknown as Projection,
    });
  }

  return children.value;
}

export function isDev() {
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
