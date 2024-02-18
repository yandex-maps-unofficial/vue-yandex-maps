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
          showScaleInCopyrights: true,
        }"
        :width="width"
        :height="isFullscreen ? '100dvh' : height"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'bottom' }">
          <yandex-map-zoom-control />
          <yandex-map-scale-control />
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'top' }">
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
            <div class="counter" @click="updateCounter">
              Entity counter #{{ counter }}
            </div>
          </yandex-map-entity>
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'top right', orientation: 'vertical' }">
          <yandex-map-control-button :settings="{ onClick: toggleFullscreen }">
            <div class="fullscreen" :class="{ 'exit-fullscreen': isFullscreen }" />
          </yandex-map-control-button>
          <yandex-map-control-button>
            <div class="button-element">
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
  YandexMapScaleControl,
  YandexMapEntity,
} from 'vue-yandex-maps';
import {
  computed, onBeforeUnmount, onMounted, ref, shallowRef, isRef,
} from 'vue';
import type { YMap } from '@yandex/ymaps3-types';

const counter = ref(1);
const timedCounter = ref(1);
const isFullscreen = ref(false);

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

const toggleFullscreen = () => {
// The document.fullscreenElement returns the Element that is currently being presented in fullscreen mode in this document, or null if fullscreen mode is not currently in use
  if (isFullscreen.value) {
    // The document.exitFullscreen() requests that the element on this document which is currently being presented in fullscreen mode be taken out of fullscreen mode
    document.exitFullscreen();
  } else {
    // The element.requestFullscreen() method issues an asynchronous request to make the element be displayed in fullscreen mode
    map.value!.container.requestFullscreen();
  }
};

onMounted(() => {
  const handleFullscreenChange = async () => {
    isFullscreen.value = !!document.fullscreenElement;
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);

  const interval = setInterval(() => {
    timedCounter.value++;
    if (timedCounter.value > 99) timedCounter.value = 0;
  }, 1000);

  onBeforeUnmount(() => {
    clearInterval(interval);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });
});
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.counter {
  color: #fff;
  pointer-events: all;
}

.button-element {
  color: #196dff;
  font-weight: bold
}

.fullscreen {
  width: 26px;
  height: 26px;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26'%3E%3Cg fill='%236B6B6B'%3E%3Cpath d='M16.14 7.86L14.27 6H20v5.7l-1.83-1.82L15.04 13 13 10.98l3.13-3.13zm0 0M9.86 18.14L11.73 20H6v-5.7l1.83 1.82L10.96 13 13 15.02l-3.13 3.13zm0 0'/%3E%3C/g%3E%3C/svg%3E");
}

.exit-fullscreen {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26'%3E%3Cg fill='%236B6B6B'%3E%3Cpath d='M8.14 15.86L6.27 14H12v5.7l-1.83-1.83-3.13 3.14L5 18.98l3.13-3.13zm0 0M17.86 10.14L19.73 12H14V6.3l1.83 1.83 3.13-3.14L21 7.02l-3.13 3.13zm0 0'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
<!-- #endregion style -->
