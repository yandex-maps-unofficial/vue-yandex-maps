<template>
    <nuxt-error-boundary>
        <div class="vue-yandex-maps-wrapper">
            <yandex-map
                v-model="yMap"
                height="500px"
                :settings="{
                    location: {
                        center: CENTER,
                        zoom: 6,
                    },
                    showScaleInCopyrights: true,
                }"
                width="100%"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>

                <yandex-map-marker
                    v-for="point in points"
                    :key="point.id"
                    class="test"
                    :settings="{
                        coordinates: point.coordinates,
                        onClick: () => pointOnClick(point),
                    }"
                >
                    <div
                        class="marker"
                        :class="{
                            'marker-red': point.isRed,
                        }"
                    >
                        #{{ point.id }}
                    </div>
                </yandex-map-marker>
            </yandex-map>
        </div>

        <template #error="{ error, clearError }">
            <div>
                <h1>Error</h1>

                <div>
                    {{ error }}
                </div>

                <div>
                    <button
                        type="button"
                        @click="clearError"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </template>
    </nuxt-error-boundary>
</template>

<script setup lang="ts">
import {
    createYmapsOptions,
    YandexMap,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    YandexMapMarker,
} from 'vue-yandex-maps';

import { ref, shallowRef } from 'vue';
import type { Ref } from 'vue';
import type { LngLat, YMap } from '@yandex/ymaps3-types';

type Point = {
    id: number;
    isRed?: boolean;
    coordinates: LngLat;
};

createYmapsOptions({
    // api key from vue-yandex-maps demo
    apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
});

const CENTER: LngLat = [37.619773, 55.753605];
const yMap: Ref<YMap | null> = shallowRef(null);

/**
 * Shuffle array items.
 * from https://stackoverflow.com/a/12646864/14110680
 */
function shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // @ts-expect-error dynamic types
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const generatePoints = () => {
    const LNG_LEFT = 35.39748145520241;
    const LNG_RIGHT = 40.262097434150434;
    const LNG_RANGE = LNG_LEFT - LNG_RIGHT;

    const LAT_TOP = 56.695110434515584;
    const LAT_BOTTOM = 54.41558522047379;
    const LAT_RANGE = LAT_BOTTOM - LAT_TOP;

    const points: Point[] = [];

    for (const i of Array(10).keys()) {
        const lng = (Math.random() * LNG_RANGE) + LNG_RIGHT;
        const lat = (Math.random() * LAT_RANGE) + LAT_TOP;

        points.push({
            id: i,
            coordinates: [lng, lat],
        });
    }

    points.push({
        id: 20,
        isRed: true,
        coordinates: [37.626372, 55.74096],
    });

    shuffleArray(points);

    return points;
};

const points = ref(generatePoints());

const pointOnClick = (point: Point) => {
    const map = yMap.value;
    if (!map) {
        return;
    }

    console.log('clicked point', point.id);

    points.value = generatePoints();

    map.setLocation({
        center: point.coordinates,
        zoom: map.zoom + 0.5,
        duration: 300,
    });

    // если не `generatePoints()` и не `map.setLocation`,
    // и сделать только `shuffleArray(points.value);`,
    // DOMException persists
};
</script>

<style lang="css" scoped>
.vue-yandex-maps-wrapper {
  margin-top: 1.25rem;
}

.vue-yandex-maps-wrapper * {
  line-height: normal;
}

.marker {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40%;
  background: oklch(0.7 0.1 176);
  width: 3rem;
  height: 3rem;
  text-align: center;
  color: black;
  font-weight: bold;
}

.marker.marker-red {
  background: oklch(0.5163 0.1751 12.18);
  color: white;
}
</style>
