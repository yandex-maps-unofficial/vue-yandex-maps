<template>
    <common-wrapper>
        <template
            #default="{
                theme, zoom, width, height,
            }"
        >
            <!-- #region html -->
            <yandex-map
                class="yandex-map"
                :height="height"
                :settings="{
                    location: {
                        center,
                        zoom,
                        duration: 300,
                    },
                    theme,
                    showScaleInCopyrights: true,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-controls :settings="{ position: 'top left' }">
                    <yandex-map-control-button>
                        Тип оверлея<br>
                        <label>
                            html
                            <input
                                v-model="overlay"
                                name="overlay"
                                type="radio"
                                value="html"
                            >
                        </label>
                        <label>
                            image
                            <input
                                v-model="overlay"
                                name="overlay"
                                type="radio"
                                value="image"
                            >
                        </label>
                        <label>
                            video
                            <input
                                v-model="overlay"
                                name="overlay"
                                type="radio"
                                value="video"
                            >
                        </label>
                    </yandex-map-control-button>
                </yandex-map-controls>
                <yandex-map-overlay
                    v-if="overlay === 'html'"
                    :settings="{ bounds: [[37.293, 55.555], [37.95, 55.92]]}"
                >
                    <div
                        class="overlay"
                        @click.stop
                    >
                        <label>
                            Reactivity test
                            <input
                                v-model="toggle"
                                type="checkbox"
                            >
                        </label>
                        <iframe
                            v-if="!toggle"
                            allowfullscreen
                            class="iframe-overlay"
                            src="https://example.org/"
                        />
                        <span v-else>Reactive!</span>
                    </div>
                </yandex-map-overlay>
                <yandex-map-image-overlay
                    v-else-if="overlay === 'image'"
                    :settings="{
                        bounds: [[48.97, 55.6], [49.23, 55.94] ],
                        imageUrl: 'https://cloudcdn-ams-07.cdn.yandex.net/download.yandex.ru/company/figures/2017/streets/big_cities/i/63B64EA97E24E28C.png',
                        className: 'example-image',
                    }"
                />
                <yandex-map-video-overlay
                    v-else-if="overlay === 'video'"
                    :settings="{
                        bounds: [ [37.293, 55.555],[37.95, 55.92] ],
                        videoUrl: '/vue-yandex-maps/video-overlay.mp4',
                        videoAttributes: {
                            autoplay: true,
                            loop: true,
                            muted: true,
                            controls: false,
                            playsInline: true,
                        },
                        className: 'example-video',
                    }"
                />
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
    YandexMapOverlay,
    YandexMapImageOverlay,
    YandexMapVideoOverlay,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSchemeLayer,
    YandexMapControls,
    YandexMapControlButton,
} from 'vue-yandex-maps';
import { onMounted, ref, watch } from 'vue';
import type { LngLat } from '@yandex/ymaps3-types';

const toggle = ref(false);
const overlay = ref<'html' | 'image' | 'video'>('html');

const center = ref<LngLat>([37.617644, 55.755819]);

onMounted(() => {
    const hash = document.location.hash;

    if (hash === '#image' || hash === '#video') {
        overlay.value = hash.slice(1, hash.length) as any;
        if (hash === '#image') center.value = [49.1, 55.77];
    }

    watch(overlay, val => {
        document.location.hash = val;

        center.value = val === 'image' ? [49.1, 55.77] : [37.617644, 55.755819];
    });
});
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.overlay {
  background: white;
  overflow: auto;
}

.yandex-map:deep(.example-video) {
    max-width: unset !important;
  }
</style>
<!-- #endregion style -->
