import type { Ref, WatchStopHandle } from 'vue';
import {
  getCurrentInstance, inject, isRef, watch,
} from 'vue';
import { throwException } from './system.ts';
import { VueYandexMaps } from '../../namespace.ts';
import type { YMap, YMapEntity, YMapGroupEntity } from '@yandex/ymaps3-types';
import type { Projection } from '@yandex/ymaps3-types/common/types';

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

export function waitTillYmapInit({ timeoutCallback }: {
  timeoutCallback?: (timeout: NodeJS.Timeout, isDelete: boolean) => any
} = {}) {
  if (typeof window === 'undefined') {
    throwException({
      text: 'waitTillYmapInit cannot be called on SSR.',
      isInternal: true,
    });
  }

  if (typeof ymaps3 !== 'undefined') return;

  return new Promise<void>((resolve, reject) => {
    if (typeof ymaps3 === 'undefined') {
      let timeout: NodeJS.Timeout | undefined;

      if (VueYandexMaps.settings.value.mapsScriptWaitDuration !== false) {
        timeout = setTimeout(() => {
          timeoutCallback?.(timeout!, true);
          reject(new VueYandexMaps.YandexMapException('Was not able to wait for map initialization in waitTillYmapInit. Ensure that map was initialized. You can change this behaviour by using mapsScriptWaitDuration.'));
        }, typeof VueYandexMaps.settings.value.mapsScriptWaitDuration === 'number' ? VueYandexMaps.settings.value.mapsScriptWaitDuration : 5000);
        timeoutCallback?.(timeout, false);
      }

      watch(VueYandexMaps.isLoaded, () => {
        if (timeout) {
          clearTimeout(timeout);
          timeoutCallback?.(timeout, true);
        }
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

export function waitTillMapInit({
  map: _map,
  timeoutCallback,
}: { map?: Ref<YMap | null>, timeoutCallback?: (timeout: NodeJS.Timeout, isDelete: boolean) => any } = {}) {
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

  if (map.value) return;

  return new Promise<void>((resolve, reject) => {
    let timeout: NodeJS.Timeout | undefined;

    if (VueYandexMaps.settings.value.mapsRenderWaitDuration !== false) {
      timeout = setTimeout(() => {
        timeoutCallback?.(timeout!, true);
        reject(new VueYandexMaps.YandexMapException('Was not able to wait for map initialization in waitTillMapInit. You can change this behaviour by using mapsRenderWaitDuration.'));
      }, typeof VueYandexMaps.settings.value.mapsRenderWaitDuration === 'number' ? VueYandexMaps.settings.value.mapsRenderWaitDuration : 5000);
      timeoutCallback?.(timeout, false);
    }

    // Breaks without this
    let watcher: WatchStopHandle | undefined;

    // eslint-disable-next-line prefer-const
    watcher = watch(map, () => {
      if (map.value) {
        watcher?.();
        if (timeout) {
          clearTimeout(timeout);
          timeoutCallback?.(timeout, true);
        }
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
