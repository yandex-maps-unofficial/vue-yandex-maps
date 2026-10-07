import type { ArgsType } from '../types';
import { pixelsToWorld as pixelsToWorldImpl, worldToPixels as worldToPixelsImpl } from '@yandex/ymaps3-world-utils';
import type * as WorldUtils from '@yandex/ymaps3-world-utils';
import { WebMercator as WebMercatorClass } from '@yandex/ymaps3-web-mercator-projection';
import { Cartesian as CartesianClass } from '@yandex/ymaps3-cartesian-projection';

/**
 * @deprecated Use import from @yandex/ymaps3-world-utils
 */
export async function worldToPixels(...args: ArgsType<typeof WorldUtils.worldToPixels>): Promise<ReturnType<typeof WorldUtils.worldToPixels>> {
    return worldToPixelsImpl(...args);
}

/**
 * @deprecated Use import from @yandex/ymaps3-world-utils
 */
export async function pixelsToWorld(...args: ArgsType<typeof WorldUtils.pixelsToWorld>): Promise<ReturnType<typeof WorldUtils.pixelsToWorld>> {
    return pixelsToWorldImpl(...args);
}

/**
 * @deprecated Use import from @yandex/ymaps3-web-mercator-projection
 */
export async function WebMercator(): Promise<typeof WebMercatorClass> {
    return WebMercatorClass;
}

/**
 * @deprecated Use import from @yandex/ymaps3-cartesian-projection
 */
export async function Cartesian(): Promise<typeof CartesianClass> {
    return CartesianClass;
}
