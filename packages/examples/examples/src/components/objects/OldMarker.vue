<template>
    <common-wrapper>
        <template
            #default="{
                theme, width, height,
            }"
        >
            <!-- #region html -->
            <yandex-map
                :height="height"
                :settings="{
                    location: LOCATION,
                    theme,
                    showScaleInCopyrights: true,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-default-marker
                    v-for="(marker) in markersGeoJsonSource.slice(2,8)"
                    :key="marker.title"
                    :settings="{ ...marker, color: marker.color }"
                />
                <yandex-map-popup-marker
                    v-for="marker in markersGeoJsonSource.slice(0,2)"
                    :key="marker.title"
                    :settings="{ coordinates: marker.coordinates, position: 'bottom', offset: 20 }"
                >
                    {{ marker.title }}
                </yandex-map-popup-marker>
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
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSchemeLayer,
    YandexMapPopupMarker,
} from 'vue-yandex-maps';
import YandexMapDefaultMarker from '../YandexMapOldDefaultMarker.vue';
import type { LngLat } from '@yandex/ymaps3-types';
import type { YMapLocationRequest } from '@yandex/ymaps3-types/imperative/YMap';

const LOCATION: YMapLocationRequest = {
    center: [18.54, 39.26], // starting position [lng, lat]
    zoom: 2, // starting zoom
};

// Array containing GeoJSON data for markers
const markersGeoJsonSource = [
    {
        coordinates: [-100.3, 50.5] as LngLat,
        title: 'North America',
        subtitle: 'Greenland is the Largest Island <br> in North America and the World',
        color: '#00CC00',
    },
    {
        coordinates: [-60.3, -10.5] as LngLat,
        title: 'South America',
        subtitle: `The Andes are the world's <br> longest continental <br> mountain range`,
        color: '#008001',
    },
    {
        coordinates: [25.5, 12.5] as LngLat,
        title: 'Africa',
        subtitle: `It is home to the world's <br> longest river, The Nile`,
        color: '#FF2400',
    },
    {
        coordinates: [88.5, 50.6] as LngLat,
        color: '#FDD52E',
        title: 'Asia',
        subtitle: 'Asia has the highest <br> mountain in the world is Everest',
    },
    {
        coordinates: [22.2, 52.9] as LngLat,
        color: '#01BBEA',
        title: 'Europe',
        subtitle: `Europe has the world's smallest <br> country, the Vatican City`,
    },
    {
        coordinates: [135.5, -25.5] as LngLat,
        color: '#627BC1',
        title: 'Australia',
        subtitle: `80% of the animals <br> are unique to Australia`,
    },
    {
        coordinates: [25.5, -79.5] as LngLat,
        color: '#999999',
        title: 'Antarctica',
        subtitle: `Ice covers roughly 98% <br> of Antarctica, which equates <br> to 90% of the Earth's ice <br> and 70% of our fresh water`,
    },
];
// #endregion setup
</script>
