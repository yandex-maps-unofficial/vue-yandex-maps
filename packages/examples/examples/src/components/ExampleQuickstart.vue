<template>
    <common-wrapper>
        <yandex-map
            v-model="map"
            height="500px"
            :settings="{
                theme: isDarkTheme ? 'dark' : 'light',
                location: {
                    center: [37.617644, 55.755819],
                    zoom: 9,
                },
            }"
            width="100%"
        >
            <yandex-map-default-scheme-layer/>
            <yandex-map-default-features-layer/>
            <yandex-map-default-marker :settings="{ coordinates: [37.617644, 55.755819]}"/>
        </yandex-map>
    </common-wrapper>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import {
    YandexMap,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultMarker,
} from 'vue-yandex-maps';
import CommonWrapper from './CommonWrapper.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
    isDarkTheme: {
        type: Boolean,
        default: false,
    },
});

const map = shallowRef<null | YMap>(null);
</script>
