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
                <yandex-map-overlay :settings="{ bounds: [[37.293, 55.555], [37.95, 55.92]]}">
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
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSchemeLayer,
} from 'vue-yandex-maps';
import { ref } from 'vue';

const toggle = ref(false);
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.overlay {
  background: white;
  overflow: auto;
}
</style>
<!-- #endregion style -->
