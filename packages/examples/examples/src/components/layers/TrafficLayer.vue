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
                <yandex-map-traffic-layer v-if="traffic"/>
                <yandex-map-traffic-events-layer v-if="events"/>
                <yandex-map-controls :settings="{ position: 'top' }">
                    <yandex-map-control-button @click="traffic = !traffic">
                        Toggle traffic
                    </yandex-map-control-button>
                    <yandex-map-control-button @click="events = !events">
                        Toggle events
                    </yandex-map-control-button>
                </yandex-map-controls>
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
} from 'vue-yandex-maps';
import {
    YandexMapControlButton,
    YandexMapControls,
    YandexMapDefaultSchemeLayer,
    YandexMapTrafficEventsLayer,
    YandexMapTrafficLayer,
} from 'vue-yandex-maps';
import { ref } from 'vue';

const traffic = ref(true);
const events = ref(true);
// #endregion setup
</script>
