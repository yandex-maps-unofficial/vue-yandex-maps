import type { Ref, WatchStopHandle } from 'vue';
import { getCurrentScope, inject, isRef, watch } from 'vue';
import { throwException } from './system.ts';
import {
    YandexMapException,
    yandexMapIsLoaded,
    yandexMapLoadError,
    yandexMapLoadStatus,
    yandexMapSettings,
} from './init.ts';
import type { YMap, YMapEntity, YMapGroupEntity } from '@yandex/ymaps3-types';
import type { Projection } from '@yandex/ymaps3-types/common/types';

export function injectMap(): Ref<YMap | null> {
    if (!getCurrentScope()) {
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
    if (!getCurrentScope()) {
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

export async function waitTillYmapInit({
    timeoutCallback,
    waitDuration,
}: {
    timeoutCallback?: (timeout: NodeJS.Timeout, isDelete: boolean) => any;
    waitDuration?: number | boolean;
} = {}): Promise<void> {
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

            waitDuration = typeof waitDuration !== 'undefined' ? waitDuration : yandexMapSettings.value.mapsScriptWaitDuration;

            if (waitDuration !== false) {
                timeout = setTimeout(() => {
                    timeoutCallback?.(timeout!, true);
                    reject(new YandexMapException('Was not able to wait for map initialization in waitTillYmapInit. Ensure that map was initialized. You can change this behavior by using mapsScriptWaitDuration.'));
                }, typeof waitDuration === 'number' ? waitDuration : 5000);
                timeoutCallback?.(timeout, false);
            }

            watch(yandexMapIsLoaded, () => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeoutCallback?.(timeout, true);
                }
                if (yandexMapLoadStatus.value === 'loaded') {
                    resolve();
                }
                else {
                    reject(yandexMapLoadError);
                }
            }, {
                immediate: true,
            });
        }
        else {
            resolve();
        }
    });
}

export async function waitTillMapInit({
    map: _map,
    timeoutCallback,
    waitDuration,
}: {
    map?: Ref<YMap | null>;
    timeoutCallback?: (timeout: NodeJS.Timeout, isDelete: boolean) => any;
    waitDuration?: number | boolean;
} = {}): Promise<void> {
    if (!_map && !getCurrentScope()) {
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

        waitDuration = typeof waitDuration !== 'undefined' ? waitDuration : yandexMapSettings.value.mapsRenderWaitDuration;

        if (waitDuration !== false) {
            timeout = setTimeout(() => {
                timeoutCallback?.(timeout!, true);
                reject(new YandexMapException('Was not able to wait for map initialization in waitTillMapInit. You can change this behavior by using mapsRenderWaitDuration.'));
            }, typeof waitDuration === 'number' ? waitDuration : 5000);
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

export function deleteMapChildren({
    children,
    isMercator,
    root,
}: {
    children: YMapEntity<unknown> | Projection;
    isMercator?: boolean;
    root: Ref<YMap | YMapGroupEntity<any> | any[] | null>;
}) {
    if (!root) {
        throwException({
            text: 'Failed to execute deleteMapChild due to destroyed root',
            isInternal: true,
        });
    }

    if (children && !isMercator) {
        if (typeof root?.value === 'object' && Array.isArray(root.value)) {
            root.value = root.value.filter(x => x !== children);
        }
        else {
            root.value?.removeChild(children as YMapEntity<unknown>);
        }
    }
    else if (root.value && children && isMercator && 'update' in root.value) {
        root.value.update({
            projection: undefined,
        });
    }
}
