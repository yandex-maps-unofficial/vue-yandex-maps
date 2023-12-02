<template>
  <common-wrapper>
    <yandex-map
      v-model="map"
      :settings="{
        location: {
          center: [37.617644, 55.755819],
          zoom: 9,
        },
      }"
      width="100%"
      height="500px"
    >
      <yandex-map-default-scheme-layer :settings="{ theme: isDarkTheme ? 'dark' : 'light' }" />
    </yandex-map>
  </common-wrapper>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import { YandexMap, YandexMapDefaultSchemeLayer } from 'vue-yandex-maps';
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
