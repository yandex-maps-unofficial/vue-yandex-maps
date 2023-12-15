<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        v-model="map"
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
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'bottom' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
        <yandex-map-controls :key="buttons" :settings="{ position: 'top' }">
          <yandex-map-control-button :settings="{ onClick: shiftRight }">
            {{ '<' }}
          </yandex-map-control-button>
          <component
            :is="component.component"
            v-for="(component, index) in buttons.slice(0, 4)"
            :key="index"
            :settings="'props' in component ? component.props : {}"
          >
            {{ isRef(component.content) ? component.content.value : component.content }}
          </component>
          <yandex-map-control-button :settings="{ onClick: shiftLeft }">
            >
          </yandex-map-control-button>
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'bottom left', orientation: 'vertical' }">
          <yandex-map-open-maps-button />
          <yandex-map-open-maps-button :settings="{ title: 'Кастомный заголовок!' }" />
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'left' }">
          <yandex-map-geolocation-control />
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'top left' }">
          <yandex-map-entity>
            <div :style="{ color: '#fff', pointerEvents: 'all' }" @click="updateCounter">
              Entity counter #{{ counter }}
            </div>
          </yandex-map-entity>
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'top right' }">
          <yandex-map-control-button>
            <div style="color: #196dff; font-weight: bold">
              Button with element
            </div>
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
  YandexMapControlButton,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapGeolocationControl,
  YandexMapOpenMapsButton,
  YandexMapZoomControl,
  YandexMapEntity,
} from 'vue-yandex-maps';
import {
  computed, onBeforeUnmount, onMounted, ref, shallowRef, isRef,
} from 'vue';
import type { YMap } from '@yandex/ymaps3-types';

const counter = ref(1);
const timedCounter = ref(1);

const map = shallowRef<YMap | null>(null);

const buttons = shallowRef([
  {
    component: YandexMapControlButton,
    content: 'first',
    props: {
      onClick: () => console.log('first'),
    },
  },
  {
    component: YandexMapControlButton,
    content: 'foo #1',
    props: {
      color: '#196dff',
      background: '#f3f6fc',
      onClick: () => console.log('foo #1'),
    },
  },
  {
    component: YandexMapControlButton,
    content: 'foo #2',
    props: {
      color: '#196dff',
      background: '#f3f6fc',
      onClick: () => console.log('foo #2'),
    },
  },
  {
    component: YandexMapControlButton,
    content: 'foo #3',
    props: {
      color: '#196dff',
      background: '#f3f6fc',
      onClick: () => console.log('foo #3'),
    },
  },
  {
    component: YandexMapControlButton,
    content: 'second',
    props: {
      onClick: () => console.log('second'),
    },
  },
  {
    component: YandexMapControlButton,
    content: 'bar #1',
    props: {
      color: '#fff',
      background: '#196dff',
      onClick: () => console.log('bar #1'),
    },
  },
  {
    component: YandexMapControlButton,
    content: 'bar #2',
    props: {
      color: '#fff',
      background: '#196dff',
      onClick: () => console.log('bar #2'),
    },
  },
  {
    component: YandexMapControlButton,
    content: computed(() => `Control! ${timedCounter.value}`),
  },
]);

const shiftLeft = () => {
  buttons.value = [...buttons.value.slice(1), buttons.value[0]];
};
const shiftRight = () => {
  buttons.value = [...buttons.value.slice(-1), ...buttons.value.slice(0, -1)];
};

const updateCounter = () => {
  counter.value++;
};

onMounted(() => {
  const interval = setInterval(() => {
    timedCounter.value++;
    if (timedCounter.value > 99) timedCounter.value = 0;
  }, 1000);

  onBeforeUnmount(() => clearInterval(interval));
});
// #endregion setup
</script>
