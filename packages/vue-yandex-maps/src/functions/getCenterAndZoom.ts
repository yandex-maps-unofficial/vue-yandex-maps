import type { LngLat, LngLatBounds, Margin, YMap, ZoomRange } from '@yandex/ymaps3-types';
import { getException, throwException } from '../utils/system.ts';
import type { Projection } from '@yandex/ymaps3-types/common/types';

interface Coords {
    x: number;
    y: number;
}

function applyModifier(coords: Coords, modifier: number) {
    const result = {
        x: 0,
        y: 0,
    };
    result.x = coords.x * modifier;
    result.y = coords.y * modifier;

    return result;
}

function applyFunctionModifier(coords: Coords, functionModifier: (coord: number, modifier: number) => number) {
    const result = {
        x: 0,
        y: 0,
    };

    result.x = functionModifier(coords.x, 1);
    result.y = functionModifier(coords.y, 2);

    return result;
}

function worldToPixels(coords: Coords, modifier: number) {
    const i = ((2 ** modifier) / 2) * 256;
    return applyModifier({
        x: coords.x + 1,
        y: 1 - coords.y,
    }, i);
}

function convertWorldCoordinates(projection: Projection, coordinates: LngLat, modifier: number) {
    const worldCoordinates = projection.toWorldCoordinates(coordinates);
    return worldToPixels(worldCoordinates, modifier);
}

function pixelsToWorld(coords: Coords, modifier: number) {
    const i = ((2 ** modifier) / 2) * 256;
    return {
        x: (coords.x / i) - 1,
        y: 1 - (coords.y / i),
    };
}

function findNeededValue(t: number, e: number, i: number) {
    return Math.max(Math.min(t, i), e);
}

function worldCoordsFromModifier(projection: Projection, coords: Coords, modifier: number) {
    const resultCoords = applyFunctionModifier(pixelsToWorld(coords, modifier), (value => findNeededValue(value, -1, 1 - 1e-15)));
    return projection.fromWorldCoordinates(resultCoords);
}

function convertBounds(projection: Projection, bounds: LngLatBounds, modifier: number) {
    const topLeft = convertWorldCoordinates(projection, bounds[0], modifier);
    const bottomRight = convertWorldCoordinates(projection, bounds[1], modifier);
    const modified = (2 ** modifier) * 256;
    const updatedBounds = [[topLeft.x, topLeft.y], [bottomRight.x, bottomRight.y]];

    if (topLeft.x > bottomRight.x) {
        updatedBounds[0][0] = topLeft.x;
        updatedBounds[1][0] = bottomRight.x + modified;
    }

    if (topLeft.y > bottomRight.y) {
        updatedBounds[0][1] = bottomRight.y;
        updatedBounds[1][1] = topLeft.y;
    }

    return updatedBounds;
}

function applyMarginToCoords(coords: Coords, margin: Margin) {
    return {
        x: Math.max(coords.x - (margin ? margin[1] + margin[3] : 0), 1),
        y: Math.max(coords.y - (margin ? margin[0] + margin[2] : 0), 1),
    };
}

function findZoom(projection: Projection, bounds: LngLatBounds, coords: Coords, isSnap: boolean, zoomRange: ZoomRange) {
    const [[topLeftFirst, topLeftSecond], [bottomRightFirst, bottomRightSecond]] = convertBounds(projection, bounds, 0);

    const firstCalc = Math.max(Math.abs(bottomRightFirst - topLeftFirst), 1e-10);
    const secondCalc = Math.max(Math.abs(bottomRightSecond - topLeftSecond), 1e-10);

    const zoom = findNeededValue(Math.min(Math.log2(coords.x / firstCalc), Math.log2(coords.y / secondCalc)), zoomRange.min, zoomRange.max);
    return isSnap ? Math.floor(zoom + 1e-6) : zoom;
}

function findCenter(projection: Projection, bounds: LngLatBounds, zoom: number) {
    const [[topLeftFirst, topLeftSecond], [bottomRightFirst, bottomRightSecond]] = convertBounds(projection, bounds, zoom);
    return worldCoordsFromModifier(projection, {
        x: (topLeftFirst + bottomRightFirst) / 2,
        y: (topLeftSecond + bottomRightSecond) / 2,
    }, zoom);
}

type YandexMapGetLocationFromBoundsRoundStrategy = 'floor' | 'round' | 'ceil';

export interface YandexMapGetLocationFromBoundsOptions {
    bounds: LngLatBounds;
    map: YMap;
    /**
     * @description If true, defaults to floor
     * @note also used in comfortZoomLevel
     */
    roundZoom?: boolean | YandexMapGetLocationFromBoundsRoundStrategy;
    /**
     * @description If true, corrects zoom by 1 level if diff from closest Math[roundZoom || 'floor'] value is less than 0.5
     * @example 16.8 -> 16.8
     * @example 16.5 -> 16.5
     * @example 16.4 -> 16
     */
    comfortZoomLevel?: boolean | {
        /**
         * @description max diff from closest Math[roundZoom || 'floor'] value to start correction
         * @default 0.5
         */
        diff?: number;
        /**
         * @description how much to correct zoom
         * @default 1
         */
        correction?: number;
        /**
         * @default roundZoom is string, 'floor' otherwise
         */
        roundStrategy?: YandexMapGetLocationFromBoundsRoundStrategy;
    };
}

export async function getLocationFromBounds({
    bounds,
    map,
    roundZoom,
    comfortZoomLevel,
}: YandexMapGetLocationFromBoundsOptions) {
    const ctxMap = Object.keys(map)
        .find(x => x.endsWith('CtxMap'));
    if (!ctxMap) {
        throwException({
            text: 'CtxMap was not found in useYMapsGetCenterAndZoomFromBounds',
            isInternal: true,
        });
    }

    // @ts-expect-error dynamic restricted key
    const ctx = map[ctxMap];
    const mapZoom = map.zoom;

    const ctxItem = await new Promise<any>((resolve, reject) => {
        ctx.forEach((item: any, { name }: { name: string }) => {
            if (name !== 'map') return;
            resolve(item);
        });

        reject(getException({
            text: 'Map item was not found in useYMapsGetCenterAndZoomFromBounds',
            isInternal: true,
        }));
    });

    const ctxItemMapKey = Object.keys(ctxItem)
        .find(x => x.endsWith('_context'));
    if (!ctxItemMapKey) {
        throwException({
            text: 'CtxMapKey was not found in useYMapsGetCenterAndZoomFromBounds',
            isInternal: true,
        });
    }

    const ctxItemMap = ctxItem[ctxItemMapKey].map;
    const boundsFunc = ctxItemMap.setBounds.toString() as string;

    const funcKey = boundsFunc.split('const{center:e,zoom:i}=')[1]?.split('(')[0];
    if (!funcKey) {
        throwException({
            text: 'funcKey was not found in useYMapsGetCenterAndZoomFromBounds',
            isInternal: true,
        });
    }

    const projection = ctxItemMap.projection;
    const size = ctxItemMap.size;
    const margin = ctxItemMap.margin;
    const isSnap = ctxItemMap.effectiveZoomRounding === 'snap';
    const zoomRange = ctxItemMap.zoomRange;

    let zoom = findZoom(projection, bounds, applyMarginToCoords(size, margin), isSnap, zoomRange);
    const center = findCenter(projection, bounds, zoom);

    if (roundZoom || comfortZoomLevel) {
        const originalZoom = zoom;
        let roundedZoom = Math[typeof roundZoom === 'string' ? roundZoom : 'floor'](zoom);

        if (roundZoom) zoom = roundedZoom;

        if (comfortZoomLevel) {
            const userSettings = typeof comfortZoomLevel === 'object' ? comfortZoomLevel : {};
            if (userSettings.roundStrategy) roundedZoom = Math[userSettings.roundStrategy](originalZoom);

            const diff = originalZoom - roundedZoom;

            const settings = {
                diff: 0.5,
                correction: 1,
                ...userSettings,
            } satisfies typeof userSettings;

            if (diff < settings.diff) {
                zoom -= settings.correction;
            }

            if (zoom <= mapZoom) {
                zoom = originalZoom;
            }
        }
    }

    return {
        zoom,
        center,
    };
}

/**
 * @deprecated Use getLocationFromBounds instead
 */
export const useYMapsLocationFromBounds = getLocationFromBounds;
