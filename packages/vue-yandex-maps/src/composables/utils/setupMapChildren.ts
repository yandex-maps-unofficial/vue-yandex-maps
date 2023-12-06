import type { YMapEntity, YMapGroupEntity } from '@yandex/ymaps3-types';
import type { Projection } from '@yandex/ymaps3-types/common/types';
import type {
  ComputedRef,
  Ref,
} from 'vue';
import {
  getCurrentInstance,
  inject,
  isRef,
  nextTick,
  onBeforeUnmount,
  provide,
  shallowRef,
  toRaw,
  watch,
} from 'vue';
import { copy, excludeKeys, throwException } from './system.ts';
import {
  deleteMapChild, injectLayers, injectMap, waitTillMapInit, waitTillYmapInit,
} from './map.ts';
import { diff } from 'deep-object-diff';

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
