<template>
    <common-wrapper>
        <template
            #default="{
                coordinates: center, theme, width, height,
            }"
        >
            <button
                type="button"
                @click="visible = !visible"
            >
                Destroy map
            </button>

            <div>Selected marker id: {{ selectedMarkerId }}</div>

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
                    :settings="{
                        features: getPointList,
                        marker: createMarker,
                    }"
                    zoom-on-cluster-click
                    @trueBounds="trueBounds = $event"
                >
                    <template #cluster="{ length }">
                        <div class="cluster fade-in">
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
    YandexMapZoomControl,
} from 'vue-yandex-maps';
import { computed, onMounted, ref, shallowRef, useCssModule, watch } from 'vue';
import type { YMapMarker } from '@yandex/ymaps3-types';
import type { LngLat, LngLatBounds, YMap } from '@yandex/ymaps3-types';
import type { Feature as ClustererFeature } from '@yandex/ymaps3-types/packages/clusterer';
import type { YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';

const map = shallowRef<YMap | null>(null);
const clusterer = shallowRef<YMapClusterer | null>(null);
const visible = ref(true);
const count = ref(5000);
const savedCount = ref(5000);
const gridSize = ref(6);

const zoom = ref(0);
const bounds = ref<LngLatBounds>([[0, 0], [0, 0]]);
const trueBounds = ref<LngLatBounds>([[0, 0], [0, 0]]);

onMounted(() => {
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

function getRandomPoint(): LngLat {
    const [x, y] = map.value!.center;
    return [
        x + ((rnd() > 0.5 ? -1 : 1) * rnd() * DELTA_LENGTH * 2),
        y + ((rnd() > 0.5 ? -1 : 1) * rnd() * DELTA_LENGTH),
    ];
}

const getPointList = computed(() => {
    if (!map.value) return [];

    const result: ClustererFeature[] = [];

    for (let i = 0; i < savedCount.value; i++) {
        const lngLat = getRandomPoint();


        result.push({
            type: 'Feature',
            id: `${ i }`,
            geometry: {
                type: 'Point',
                coordinates: lngLat,
            },
        });
    }

    return result;
});


const allMarkers: Map<string, YMapMarker> = new Map();
const selectedMarkerId = ref<string | null>(null);

const updateMarker = (feature: ClustererFeature) => {
    const marker = allMarkers.get(feature.id);

    if (!marker) {
        return;
    }

    const bg = selectedMarkerId.value == feature.id ? '#AC0707' : '';

    marker.element.style.background = bg;
};

const cssModule = useCssModule();
const createMarker = (feature: ClustererFeature) => {
    const featureCircle = document.createElement('div');
    featureCircle.classList.add(cssModule['feature-circle']);
    featureCircle.innerHTML = `<span>#${ feature.id }</span>`;

    if (feature.id == selectedMarkerId.value) {
        featureCircle.style.background = '#AC0707';
    }

    const yMapMarker = new ymaps3.YMapMarker(
        {
            id: feature.id,
            coordinates: feature.geometry.coordinates,
            onClick() {
                const prevSelectedId = selectedMarkerId.value;

                selectedMarkerId.value = feature.id;

                if (prevSelectedId) {
                    const previousFeature = getPointList.value.find(f => f.id == prevSelectedId);

                    if (previousFeature) {
                        updateMarker(previousFeature);
                    }
                }

                updateMarker(feature);
            },
        },
        featureCircle,
    );

    allMarkers.set(feature.id, yMapMarker);

    return yMapMarker;
};
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.bounds {
  user-select: all;
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


<style module>
.feature-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    background: green;
    width: 40px;
    height: 40px;
    color: white;
    font-size: 12px;
}
</style>
<!-- #endregion style -->
