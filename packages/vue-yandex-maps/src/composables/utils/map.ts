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

export function waitTillYmapInit() {
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

      if (VueYandexMaps.settings.value.yandexMapsScriptWaitDuration !== false) {
        timeout = setTimeout(() => {
          reject(new VueYandexMaps.YandexMapException('Was not able to wait for map initialization in waitTillYmapInit. Ensure that map was initialized.'));
        }, typeof VueYandexMaps.settings.value.yandexMapsScriptWaitDuration === 'number' ? VueYandexMaps.settings.value.yandexMapsScriptWaitDuration : 5000);
      }

      watch(VueYandexMaps.isLoaded, () => {
        if (timeout) clearTimeout(timeout);
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

  if (map.value) return;

  return new Promise<void>((resolve, reject) => {
    let timeout: NodeJS.Timeout | undefined;

    if (VueYandexMaps.settings.value.mapsRenderWaitDuration !== false) {
      timeout = setTimeout(() => {
        reject(new VueYandexMaps.YandexMapException('Was not able to wait for map initialization in waitTillMapInit.'));
      }, typeof VueYandexMaps.settings.value.mapsRenderWaitDuration === 'number' ? VueYandexMaps.settings.value.mapsRenderWaitDuration : 5000);
    }

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
