import { importYmapsCDNModule } from './init.ts';
import type { ArgsType } from '../types';
import type * as WorldUtils from '@yandex/ymaps3-world-utils';
import type { WebMercator as _WebMercator } from '@yandex/ymaps3-web-mercator-projection';
import type { Cartesian as _Cartesian } from '@yandex/ymaps3-cartesian-projection';

export async function worldToPixels(...args: ArgsType<typeof WorldUtils.worldToPixels>): Promise<ReturnType<typeof WorldUtils.worldToPixels>> {
    return (await importYmapsCDNModule('@yandex/ymaps3-world-utils')).worldToPixels(...args);
}

export async function pixelsToWorld(...args: ArgsType<typeof WorldUtils.pixelsToWorld>): Promise<ReturnType<typeof WorldUtils.pixelsToWorld>> {
    return (await importYmapsCDNModule('@yandex/ymaps3-world-utils')).pixelsToWorld(...args);
}

export async function WebMercator(): Promise<typeof _WebMercator> {
    return (await importYmapsCDNModule('@yandex/ymaps3-web-mercator-projection')).WebMercator;
}

export async function Cartesian(): Promise<typeof _Cartesian> {
    return (await importYmapsCDNModule('@yandex/ymaps3-cartesian-projection')).Cartesian;
}
