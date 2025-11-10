import type { YMapEntity, YMapGroupEntity } from '@yandex/ymaps3-types';
import type { Projection } from '@yandex/ymaps3-types/common/types';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { getCurrentInstance, inject, isRef, nextTick, onBeforeUnmount, provide, shallowRef, watch } from 'vue';
import { copy, excludeKeys, throwException, toValue } from './system.ts';
import { deleteMapChild, injectLayers, injectMap, waitTillMapInit, waitTillYmapInit } from './map.ts';
import { diff } from 'deep-object-diff';

export async function setupMapChildren<T extends YMapEntity<unknown> | Projection, R extends (() => Promise<unknown>)>({
    returnOnly,
    willDeleteByHand,
    strictMapRoot,
    requiredImport,
    createFunction,
    settings,
    settingsUpdateIgnoreKeys,
    settingsUpdateFull,
    isLayer,
    isMercator,
    isMapRoot,
    mapRootRef,
    duplicateInit,
    index,
}: {
    /**
     * @description Prevents duplicate provide injections
     */
    duplicateInit?: boolean;

    /**
     * @description Disables onBeforeUnmount hook
     */
    willDeleteByHand?: boolean;

    /**
     * @description Disables children-to-root injection
     */
    returnOnly?: boolean;

    /**
     * @description Requires map root to be present (map root can't be YMap in this case)
     */
    strictMapRoot?: boolean;

    /**
     * @description Sets injected component to be root of children components (array.push/.addChild will be called)
     */
    isMapRoot?: boolean;

    /**
     * @description Allows to use array instead of addChild mapRoot injection
     */
    mapRootRef?: Ref<YMapEntity<any>[]>;

    /**
     * @description Promise to call before calling createFunction. Executes only after Yandex script has been injected
     */
    requiredImport?: R;

    /**
     * @description Function that returns Yandex entity
     */
    createFunction: (neededImport: Awaited<ReturnType<R>>) => T;

    /**
     * @description Entity reactive settings. If passed, will be auto-watched
     */
    settings?: ComputedRef<Record<string, any>>;
    /**
     * @description Allows to not-update specific keys inside of settings watch
     */
    settingsUpdateIgnoreKeys?: string[] | ComputedRef<string[]>;
    /**
     * @description skips diff check
     */
    settingsUpdateFull?: boolean;

    /**
     * @description Specifies that entity is a layer children. Will be injected to layer ref instead of root and will skip YandexMap initialization
     */
    isLayer?: boolean;
    /**
     * @description Specifies that entity is a layer children. Will be injected to layer ref instead of root and will skip YandexMap initialization, and will be added in special way to YandexMap
     */
    isMercator?: boolean;
    /**
     * @description Index of the child for map collection. If not passed, will be added to the end
     */
    index?: MaybeRefOrGetter<number | undefined>;
}) {
    if (!getCurrentInstance()) {
        throwException({
            text: 'setupMapChildren must be only called on runtime.',
            isInternal: true,
        });
    }

    try {
        const children = shallowRef<T | undefined>();
        const mapRoot = inject<Ref<YMapGroupEntity<any> | any[]> | null>('mapRoot', null);
        const initPromises = inject<Ref<PromiseLike<any>[]> | null>('mapRootInitPromises', null);
        let childrenPromises;
        const map = injectMap();
        const layers = injectLayers();
        let timeouts: Set<NodeJS.Timeout> | null = null;

        const timeoutCallback = (timeout: NodeJS.Timeout, isDelete: boolean) => {
            if (!timeouts) timeouts = new Set();
            if (!isDelete) timeouts.add(timeout);
            else timeouts.delete(timeout);
        };

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

                if (timeouts?.size) {
                    timeouts.forEach(timeout => clearTimeout(timeout));
                    timeouts.clear();
                }
            });
        }

        if (settings) {
            let lastSettings = copy(settings);

            watch(settings, value => {
                if (!value) return;

                if (settingsUpdateFull) {
                    console.log(value);
                    if (children.value && 'update' in children.value) children.value.update(value);
                    return;
                }

                const settingsDiff = Object.keys(diff(lastSettings, value));
                if (settingsDiff.length === 0) return;

                const updatedSettings = copy(value);
                for (const key in updatedSettings) {
                    if (!settingsDiff.includes(key)) delete (updatedSettings as any)[key];
                }

                const ignoreKeys = settingsUpdateIgnoreKeys && (isRef(settingsUpdateIgnoreKeys) ? settingsUpdateIgnoreKeys.value : settingsUpdateIgnoreKeys);
                if (ignoreKeys) excludeKeys(updatedSettings, ignoreKeys);

                if (Object.keys(updatedSettings).length === 0) return;

                lastSettings = copy(value);

                if (children.value && 'update' in children.value) children.value.update(updatedSettings);
            }, { deep: true });
        }


        if (!returnOnly && !isMercator) {
            watch(() => toValue(index), indexValue => {
                if (!children.value || !map.value) {
                    return;
                }

                deleteMapChild({
                    children: children.value,
                    isMercator,
                    root: mapRoot?.value ? mapRoot : map,
                });

                if (typeof mapRoot?.value === 'object' && Array.isArray(mapRoot.value)) {
                    mapRoot.value = [
                        ...mapRoot.value,
                        children.value,
                    ];
                }
                else {
                    (mapRoot?.value || map.value).addChild(children.value as YMapEntity<unknown>, indexValue);
                }
            });
        }

        if (!isLayer && !isMercator) {
            await waitTillMapInit({ timeoutCallback });
            if (!map.value) {
                throwException({
                    text: 'map is undefined in setupMapChildren. Please verify that Yandex Maps were initialized successfully and you only use components inside <yandex-map>.',
                });
            }
        }
        else {
            await waitTillYmapInit({ timeoutCallback });
        }

        if (strictMapRoot) {
            if (!mapRoot?.value) await nextTick();
            if (!mapRoot?.value) {
                throwException({
                    text: `mapRoot is undefined in setupMapChildren. Please verify that you are using component inside it's root: for example, don't use Controls outside <yandex-map-controls>.`,
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

            const indexValue = toValue(index);

            if (typeof mapRoot?.value === 'object' && Array.isArray(mapRoot.value)) {
                mapRoot.value.splice(indexValue ?? mapRoot.value.length, 0, children.value);
            }
            else {
                (mapRoot?.value || map.value).addChild(children.value as YMapEntity<unknown>, indexValue);
            }
        }
        else if (isLayer) {
            layers.value.push(children.value);
        }
        else if (isMercator && map.value) {
            map.value.update({
                projection: children.value as unknown as Projection,
            });
        }

        return children.value;
    }
    catch (e) {
        console.error('Error during map children loading', e);
        throw e;
    }
}
