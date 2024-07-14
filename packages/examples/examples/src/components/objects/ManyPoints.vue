<template>
    <common-wrapper>
        <template
            #default="{
                coordinates: center, theme, width, height,
            }"
        >
            <button @click="visible = !visible">
                Destroy map
            </button>

            <!-- #region html -->
            <yandex-map
                v-if="visible"
                v-model="map"
                cursor-grab
                :height="height"
                :settings="{
                    location: {
                        center,
                        zoom: 5,
                    },
                    theme,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-controls :settings="{ position: 'top left' }">
                    <yandex-map-control>
                        <label class="padded">
                            Elements count: {{ count }}
                            <input
                                v-model="count"
                                max="30000"
                                min="500"
                                step="500"
                                type="range"
                            >
                        </label>
                        <label class="padded">
                            Grid Size: {{ 2 ** gridSize }}
                            <!-- @vue-ignore -->
                            <input
                                max="11"
                                min="6"
                                type="range"
                                :value="gridSize"
                                @input="gridSize = $event.target.value"
                            >
                        </label>
                    </yandex-map-control>
                </yandex-map-controls>
                <yandex-map-controls :settings="{ position: 'bottom left', orientation: 'vertical' }">
                    <yandex-map-control-button>
                        Zoom: {{ zoom }}
                    </yandex-map-control-button>
                    <yandex-map-control-button>
                        Bounds: <span class="bounds">{{ JSON.stringify(bounds) }}</span>
                    </yandex-map-control-button>
                    <yandex-map-control-button>
                        True bounds: <span class="bounds">{{ JSON.stringify(trueBounds) }}</span>
                    </yandex-map-control-button>
                </yandex-map-controls>
                <yandex-map-controls :settings="{ position: 'right' }">
                    <yandex-map-zoom-control/>
                </yandex-map-controls>
                <yandex-map-clusterer
                    v-model="clusterer"
                    :grid-size="2 ** gridSize"
                    zoom-on-cluster-click
                    @trueBounds="trueBounds = $event"
                >
                    <yandex-map-marker
                        v-for="(coordinates) in getPointList"
                        :key="coordinates.join(',')"
                        :settings="{
                            coordinates,
                            onClick: () => background = background === 'red' ? 'green' : 'red',
                        }"
                    >
                        <div
                            class="marker"
                            :style="{
                                '--background': background,
                            }"
                        />
                    </yandex-map-marker>
                    <template #cluster="{ length }">
                        <div
                            class="cluster fade-in"
                            :style="{
                                'background': background,
                            }"
                        >
                            {{ length }}
                        </div>
                    </template>
                </yandex-map-clusterer>
            </yandex-map>
            <!-- #endregion html -->
        </template>
    </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
    YandexMap,
    YandexMapClusterer,
    YandexMapControl,
    YandexMapControlButton,
    YandexMapControls,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSchemeLayer,
    YandexMapMarker,
    YandexMapZoomControl,
} from 'vue-yandex-maps';
import { computed, onMounted, ref, shallowRef, version, watch } from 'vue';
import type { LngLat, LngLatBounds, YMap } from '@yandex/ymaps3-types';
import type { YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';

const map = shallowRef<YMap | null>(null);
const clusterer = shallowRef<YMapClusterer | null>(null);
const visible = ref(true);
const count = ref(500);
const savedCount = ref(500);
const gridSize = ref(6);
const background = ref('red');
const zoom = ref(0);
const bounds = ref<LngLatBounds>([[0, 0], [0, 0]]);
const trueBounds = ref<LngLatBounds>([[0, 0], [0, 0]]);

onMounted(() => {
    if (version.startsWith('2')) return;
    setInterval(() => {
        if (map.value) {
            zoom.value = map.value.zoom;
            bounds.value = map.value.bounds;
        }
    }, 1000);
});

watch(count, async val => {
    const oldVal = val;
    setTimeout(() => {
        if (oldVal !== count.value) return;
        savedCount.value = val;
    }, 500);
});

watch(map, val => console.log('map', val));
watch(clusterer, val => console.log('cluster', val));

const seed = (s: number) => () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
};

const rnd = seed(10000);

const DELTA_LENGTH = 5;

function getRandomPoint() {
    const [x, y] = map.value!.center;
    return [
        x + ((rnd() > 0.5 ? -1 : 1) * rnd() * DELTA_LENGTH * 2),
        y + ((rnd() > 0.5 ? -1 : 1) * rnd() * DELTA_LENGTH),
    ];
}

// @ts-expect-error strict type error
const getPointList = computed<LngLat[]>(() => {
    if (!map.value) return [];
    const result = [];

    for (let i = 0; i < savedCount.value; i++) {
        result.push(getRandomPoint());
    }

    return result;
});

// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.bounds {
  user-select: all;
}

.marker {
  background: var(--background);
  border-radius: 100%;
  width: 20px;
  height: 20px;
}

.cluster {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background: green;
  color: #fff;
  border-radius: 100%;
  cursor: pointer;
  border: 2px solid limegreen;
  outline: 2px solid green;
  text-align: center;
}

.padded {
  padding: 5px;
}

.fade-in {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
<!-- #endregion style -->
