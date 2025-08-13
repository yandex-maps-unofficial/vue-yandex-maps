<template>
    <common-wrapper>
        <template
            #default="{
                coordinates: center, theme, width, height,
            }"
        >
            <!-- #region html -->
            <yandex-map
                :height="height"
                :settings="{
                    location: {
                        center,
                        zoom: 12,
                    },
                    theme,
                    showScaleInCopyrights: true,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-controls :settings="{ position: 'left' }">
                    <yandex-map-spinner
                        v-model="spinner"
                        :settings
                    />
                </yandex-map-controls>
                <yandex-map-controls :settings="{ position: 'top right' }">
                    <yandex-map-control>
                        <div class="settings">
                            <label>
                                {{ settings.lines }}
                                <input
                                    max="20"
                                    min="5"
                                    step="1"
                                    type="range"
                                    :value="settings.lines"
                                    @input="settings.lines = +($event.target as HTMLInputElement).value"
                                >
                                lines
                            </label>
                            <label>
                                {{ settings.length }}
                                <input
                                    max="80"
                                    min="0"
                                    step="1"
                                    type="range"
                                    :value="settings.length"
                                    @input="settings.length = +($event.target as HTMLInputElement).value"
                                >
                                length
                            </label>
                            <label>
                                {{ settings.width }}
                                <input
                                    max="52"
                                    min="2"
                                    step="1"
                                    type="range"
                                    :value="settings.width"
                                    @input="settings.width = +($event.target as HTMLInputElement).value"
                                >
                                width
                            </label>
                            <label>
                                {{ settings.radius }}
                                <input
                                    max="84"
                                    min="0"
                                    step="1"
                                    type="range"
                                    :value="settings.radius"
                                    @input="settings.radius = +($event.target as HTMLInputElement).value"
                                >
                                radius
                            </label>
                            <label>
                                {{ settings.corners }}
                                <input
                                    max="1"
                                    min="0"
                                    step="0.1"
                                    type="range"
                                    :value="settings.corners"
                                    @input="settings.corners = +($event.target as HTMLInputElement).value"
                                >
                                corners
                            </label>
                            <label>
                                {{ settings.speed }}
                                <input
                                    max="2.2"
                                    min="0.5"
                                    step="0.1"
                                    type="range"
                                    :value="settings.speed"
                                    @input="settings.speed = +($event.target as HTMLInputElement).value"
                                >
                                speed
                            </label>
                            <div class="animation">
                                <div class="animation_title">
                                    Анимация
                                </div>
                                <div class="animation_list">
                                    <label
                                        v-for="animation in ['fade-default', 'fade-quick', 'fade-more', 'shrink']"
                                        :key="animation"
                                    >
                                        <input
                                            :checked="settings.animation === `spinner-line-${ animation }`"
                                            name="animation"
                                            type="radio"
                                            :value="`spinner-line-${ animation }`"
                                            @input="settings.animation = `spinner-line-${ animation }`"
                                        >
                                        {{ animation }}
                                    </label>
                                </div>
                            </div>
                            <label>
                                <input
                                    :checked="settings.direction === 1"
                                    type="checkbox"
                                    @input="settings.direction = settings.direction === 1 ? settings.direction = -1 : settings.direction = 1"
                                >
                                По часовой стрелке
                            </label>
                            <label>
                                <input
                                    v-model="settings.color"
                                    type="color"
                                >
                                Основной цвет
                            </label>
                            <label>
                                <input
                                    v-model="settings.fadeColor"
                                    type="color"
                                >
                                Цвет перехода
                            </label>
                        </div>
                    </yandex-map-control>
                </yandex-map-controls>
            </yandex-map>
            <!-- #endregion html -->
        </template>
    </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import { YandexMap, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMapSpinner, YandexMapControls, YandexMapControl } from 'vue-yandex-maps';
import type { YMapSpinnerProps } from '@yandex/ymaps3-spinner';
import { reactive, shallowRef, watch } from 'vue';

const spinner = shallowRef<any>(null);

watch(spinner, console.log);

const settings = reactive<Partial<YMapSpinnerProps>>({
    lines: 12,
    length: 7,
    width: 5,
    radius: 10,
    corners: 1,
    speed: 1,
    color: '#969696',
    fadeColor: 'transparent',
    animation: 'spinner-line-fade-default',
    direction: 1,
});
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  padding: 4px;
  gap: 4px;

  label {
    display: flex;
    align-items: center;
  }

  .animation {
    .animation_list {
      display: grid;
      grid-template-columns: repeat(2, 49%);
      justify-content: space-between;
      font-size: 12px;
    }
  }
}
</style>
<!-- #endregion style -->
