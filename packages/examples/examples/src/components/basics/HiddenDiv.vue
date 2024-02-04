<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
      <!-- #region html -->
      <h3 @click="isShow = !isShow">
        Переключить карту в v-show
      </h3>
      <h3 @click="isIf = !isIf">
        Переключить карту в v-if
      </h3>

      <template v-for="i in 2" :key="i">
        <template v-if="i === 1 && isShow">
          V-Show Map:
        </template>
        <template v-else-if="i === 2 && isIf">
          V-If Map:
        </template>
        <yandex-map
          v-if="i === 1 || isIf"
          v-show="i === 2 || isShow"
          :settings="{
            location: {
              center,
              zoom,
            },
            theme,
          }"
          :width="width"
          :height="height"
        >
          <yandex-map-default-scheme-layer />
          <yandex-map-controls :settings="{ position: 'right' }">
            <yandex-map-zoom-control />
          </yandex-map-controls>
        </yandex-map>
        <br v-if="i === 1 && isShow && isIf">
      </template>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap, YandexMapControls, YandexMapDefaultSchemeLayer, YandexMapZoomControl,
} from 'vue-yandex-maps';
import { ref } from 'vue';

const isShow = ref(false);
const isIf = ref(false);
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
h3 {
  cursor: pointer;
  text-decoration: underline;
  user-select: none;
  margin: 10px 0;
}
</style>
<!-- #endregion style -->
