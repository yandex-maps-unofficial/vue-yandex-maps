import { importYmapsCDNModule } from './init.ts';
import type { ArgsType } from '../types';
import type * as WorldUtils from '@yandex/ymaps3-world-utils';

export async function worldToPixels(...args: ArgsType<typeof WorldUtils.worldToPixels>): Promise<ReturnType<typeof WorldUtils.worldToPixels>> {
    return (await importYmapsCDNModule('@yandex/ymaps3-world-utils')).worldToPixels(...args);
}

export async function pixelsToWorld(...args: ArgsType<typeof WorldUtils.pixelsToWorld>): Promise<ReturnType<typeof WorldUtils.pixelsToWorld>> {
    return (await importYmapsCDNModule('@yandex/ymaps3-world-utils')).pixelsToWorld(...args);
}
