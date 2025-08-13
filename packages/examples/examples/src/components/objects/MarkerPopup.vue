<template>
    <common-wrapper>
        <template
            #default="{
                coordinates: center, theme, zoom, width, height,
            }"
        >
            <!-- #region html -->
            <yandex-map
                :height="height"
                :settings="{
                    location: {
                        center,
                        zoom,
                    },
                    theme,
                    showScaleInCopyrights: true,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-controls :settings="{ position: 'right' }">
                    <yandex-map-zoom-control/>
                </yandex-map-controls>

                <yandex-map-default-marker
                    :settings="{
                        coordinates: center,
                        title: 'Marker with slot',
                        subtitle: 'Marker with slot description',
                        color: 'green',
                        popup: { position: 'top' },
                    }"
                >
                    <template #popup="{ close }">
                        <div
                            class="marker-popup"
                            @click="close()"
                        >
                            Click me to close popup
                        </div>
                    </template>
                </yandex-map-default-marker>

                <yandex-map-default-marker
                    :settings="{
                        coordinates: [37.188144, 55.933842],
                        title: 'Marker with static content',
                        subtitle: 'Marker with static content description',
                        color: 'green',
                        popup: { position: 'top', content: 'Static content that hides marker', hidesMarker: true },
                    }"
                >
                    <template #popup="{ close }">
                        <div
                            class="marker-popup"
                            @click="close()"
                        >
                            Click me to close popup
                        </div>
                    </template>
                </yandex-map-default-marker>

                <yandex-map-ui-marker
                    :settings="{
                        coordinates: [37.688144, 55.933842],
                        title: 'UI Marker',
                        subtitle: 'Click to open popup',
                        color: 'green',
                        onClick: () => show = !show,
                        popup: { position: 'top', show },
                    }"
                >
                    <template #popup>
                        <div class="marker-popup">
                            Click me to close popup {{ reactivityTestCounter }}
                        </div>
                    </template>
                </yandex-map-ui-marker>

                <yandex-map-marker
                    v-for="(marker, index) in markers"
                    :key="index"
                    :settings="{ coordinates: marker.coordinates, onClick: () => openMarker = index, zIndex: openMarker === index ? 1 : 0 }"
                >
                    <div
                        class="marker"
                    >
                        Marker {{ index }}

                        <div
                            v-if="openMarker === index"
                            class="popup"
                            @click.stop="openMarker = null"
                        >
                            Click me to close popup
                        </div>
                    </div>
                </yandex-map-marker>
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
    YandexMapControls,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultMarker,
    YandexMapDefaultSchemeLayer,
    YandexMapMarker,
    YandexMapZoomControl,
    YandexMapUiMarker,
} from 'vue-yandex-maps';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { LngLat } from '@yandex/ymaps3-types';

const show = ref(false);
const markers: { coordinates: LngLat }[] = [
    {
        coordinates: [37.188144, 55.733842],
    },
    {
        coordinates: [37.588144, 55.733842],
    },
    {
        coordinates: [37.988144, 55.733842],
    },
];

const openMarker = ref<null | number>(null);
const reactivityTestCounter = ref(0);
onMounted(() => {
    const interval = setInterval(() => reactivityTestCounter.value++, 1000);
    onBeforeUnmount(() => clearInterval(interval));
});
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.marker-popup {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  color: black;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.marker {
  background: green;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  color: #fff;
  padding: 10px 20px;
  white-space: nowrap;
}

.popup {
  position: absolute;
  top: calc(100% + 10px);
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  color: black;
}
</style>
<!-- #endregion style -->
