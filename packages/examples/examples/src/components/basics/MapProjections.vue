<template>
    <common-wrapper>
        <template #default="{ theme, width, height }">
            <!-- #region html -->
            <div class="projection-maps">
                <section class="projection-map">
                    <h2>Web Mercator</h2>
                    <yandex-map
                        :height="height"
                        :settings="{
                            location: { center: MERCATOR_POINT, zoom: ZOOM },
                            theme,
                            showScaleInCopyrights: true,
                        }"
                        :width="width"
                    >
                        <yandex-map-web-mercator-projection/>
                        <yandex-map-default-scheme-layer/>
                        <yandex-map-default-features-layer/>
                        <yandex-map-default-marker :settings="{ coordinates: MERCATOR_POINT, title: 'Исходная точка' }"/>
                        <yandex-map-controls :settings="{ position: 'top left' }">
                            <yandex-map-control>
                                <div class="projection-output">
                                    <strong>Меркатор → мир → пиксели</strong>
                                    <template v-if="mercatorResult">
                                        <div>Координаты: {{ formatPair(MERCATOR_POINT) }}</div>
                                        <div>Мир: {{ formatObject(mercatorResult.world) }}</div>
                                        <div>Пиксели, zoom {{ ZOOM }}: {{ formatObject(mercatorResult.pixels, 0) }}</div>
                                        <div>Обратно: {{ formatPair(mercatorResult.restored) }}</div>
                                    </template>
                                    <div v-else>
                                        Вычисляем координаты…
                                    </div>
                                </div>
                            </yandex-map-control>
                        </yandex-map-controls>
                    </yandex-map>
                </section>

                <section class="projection-map">
                    <h2>Декартова проекция</h2>
                    <yandex-map
                        :height="height"
                        :settings="{
                            location: { center: [0, 0], zoom: 4 },
                            mode: 'raster',
                            zoomRange: { min: 3, max: 6 },
                            restrictMapArea: [[-7287.5, -4220.5], [7287.5, 4220.5]],
                            worldOptions: { cycledX: false, cycledY: false },
                            showScaleInCopyrights: true,
                            theme,
                        }"
                        :width="width"
                    >
                        <yandex-map-cartesian-projection :bounds="CARTESIAN_BOUNDS"/>
                        <yandex-map-tile-data-source :settings="cartesianTileSource"/>
                        <yandex-map-layer :settings="cartesianTileLayer"/>
                        <yandex-map-default-features-layer/>
                        <yandex-map-default-marker :settings="{ coordinates: CARTESIAN_POINT, title: 'Исходная точка' }"/>
                        <yandex-map-default-marker :settings="{ coordinates: [0, 0], title: 'Центр' }"/>
                        <yandex-map-controls :settings="{ position: 'top left' }">
                            <yandex-map-control>
                                <div class="projection-output">
                                    <strong>Декартовы координаты → мир</strong>
                                    <template v-if="cartesianResult">
                                        <div>Координаты: {{ formatPair(CARTESIAN_POINT) }}</div>
                                        <div>Мир: {{ formatObject(cartesianResult.world) }}</div>
                                        <div>Обратно: {{ formatPair(cartesianResult.restored) }}</div>
                                    </template>
                                    <div v-else>
                                        Вычисляем координаты…
                                    </div>
                                </div>
                            </yandex-map-control>
                        </yandex-map-controls>
                    </yandex-map>
                </section>
            </div>
            <!-- #endregion html -->
        </template>
    </common-wrapper>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { LngLat, LngLatBounds } from '@yandex/ymaps3-types';
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
    Cartesian,
    WebMercator,
    pixelsToWorld,
    worldToPixels,
} from 'vue-yandex-maps';
import {
    YandexMap,
    YandexMapCartesianProjection,
    YandexMapControl,
    YandexMapControls,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultMarker,
    YandexMapDefaultSchemeLayer,
    YandexMapWebMercatorProjection,
    YandexMapLayer,
    YandexMapTileDataSource,
} from 'vue-yandex-maps/vapor';
import type { YMapLayerProps, YMapTileDataSourceProps } from '@yandex/ymaps3-types';

const MERCATOR_POINT: LngLat = [37.6173, 55.7558];
// Bounds for the Cartesian projection sample tiles.
const CARTESIAN_BOUNDS: LngLatBounds = [[-7287.5, -12163.5], [9096.5, 4220.5]];
const CARTESIAN_POINT: LngLat = [200, 150];
const ZOOM = 5;

const cartesianTileSource: YMapTileDataSourceProps = {
    id: 'cartesian-image',
    copyrights: ['© NASA', '© ESA', '© CSA', '© STScI'],
    raster: {
        type: 'tile',
        fetchTile: 'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/cartesian-projection/tiles/{{z}}/{{y}}-{{x}}.png',
    },
};

const cartesianTileLayer: YMapLayerProps = {
    id: 'cartesian-image-layer',
    source: 'cartesian-image',
    type: 'tile',
};

const mercatorResult = ref<{
    world: { x: number; y: number };
    pixels: { x: number; y: number };
    restored: LngLat;
} | null>(null);

const cartesianResult = ref<{
    world: { x: number; y: number };
    restored: LngLat;
} | null>(null);

onMounted(async () => {
    const MercatorProjection = await WebMercator();
    const mercator = new MercatorProjection();
    const world = mercator.toWorldCoordinates(MERCATOR_POINT);
    const pixels = await worldToPixels(world, ZOOM);
    const restoredWorld = await pixelsToWorld(pixels, ZOOM);

    mercatorResult.value = {
        world,
        pixels,
        restored: mercator.fromWorldCoordinates(restoredWorld),
    };

    const CartesianProjection = await Cartesian();
    const cartesian = new CartesianProjection(CARTESIAN_BOUNDS);
    const cartesianWorld = cartesian.toWorldCoordinates(CARTESIAN_POINT);

    cartesianResult.value = {
        world: cartesianWorld,
        restored: cartesian.fromWorldCoordinates(cartesianWorld),
    };
});

function formatPair([x, y]: LngLat, digits = 5) {
    return `[${ x.toFixed(digits) }, ${ y.toFixed(digits) }]`;
}

function formatObject({ x, y }: { x: number; y: number }, digits = 5) {
    return `{ x: ${ x.toFixed(digits) }, y: ${ y.toFixed(digits) } }`;
}
// #endregion setup
</script>

<style scoped>
.projection-maps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
    gap: 18px;
}

.projection-map h2 {
    margin: 0 0 10px;
    font-size: 18px;
}

.projection-output {
    max-width: min(340px, calc(100vw - 80px));
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    box-shadow: 0 2px 8px #0002;
    font-size: 12px;
    line-height: 1.5;
}

.projection-output strong {
    display: block;
    margin-bottom: 4px;
}
</style>
