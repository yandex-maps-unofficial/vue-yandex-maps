<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        class="events"
        :class="[`theme--${theme}`]"
        :settings="{
          location: {
            center,
            zoom,
          },
          behaviors: BEHAVIOR,
          theme,
          showScaleInCopyrights: true,
        }"
        :width="width"
        :height="resizeHeight ? `calc(${height} + 100px)` : height"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-controls :settings="{ position: 'top left' }">
          <yandex-map-entity class="events-container">
            <div class="events-block">
              <div class="events-block_title">
                DOM Events
              </div>
              <div
                v-for="(value, key) in events.dom"
                :key="key"
                class="events-block_item"
                :class="{ 'events-block_item--active': value }"
              >
                {{ key }}
              </div>
            </div>
          </yandex-map-entity>
          <yandex-map-entity class="events-container">
            <div class="events-block">
              <div class="events-block_title">
                Map Events
              </div>
              <div
                v-for="(value, key) in events.map"
                :key="key"
                class="events-block_item"
                :class="{ 'events-block_item--active': value }"
              >
                {{ key }}
              </div>
            </div>
            <div class="events-block">
              <div class="events-block_title">
                Behavior Events
              </div>
              <div
                v-for="(value, key) in events.behavior"
                :key="key"
                class="events-block_item"
                :class="{ 'events-block_item--active': value }"
              >
                {{ key }}
              </div>
            </div>
          </yandex-map-entity>
        </yandex-map-controls>
        <yandex-map-controls :settings="{ position: 'top right' }">
          <yandex-map-control-button :settings="{ onClick: () => resizeHeight = !resizeHeight }">
            Изменить высоту карты
          </yandex-map-control-button>
        </yandex-map-controls>
        <yandex-map-listener
          :settings="{
            onUpdate: createEvent('map', 'update'),
            onResize: createEvent('map', 'resize'),

            onClick: createEvent('dom', 'click'),
            onFastClick: createEvent('dom', 'fastClick'),
            onDblClick: createEvent('dom', 'dblClick'),
            onContextMenu: createEvent('dom', 'contextMenu'),
            onRightDblClick: createEvent('dom', 'rightDblClick'),
            onMouseMove: createEvent('dom', 'mouseMove'),
            onMouseEnter: createEvent('dom', 'mouseEnter'),
            onMouseLeave: createEvent('dom', 'mouseLeave'),
            onMouseDown: createEvent('dom', 'mouseDown'),
            onMouseUp: createEvent('dom', 'mouseUp'),

            onActionStart: createEvent('behavior', true),
            onActionEnd: createEvent('behavior', false),
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
  YandexMapControlButton,
  YandexMapControls,
  YandexMapDefaultSchemeLayer,
  YandexMapEntity,
  YandexMapListener,
} from 'vue-yandex-maps';
import { reactive, ref } from 'vue';
import type { BehaviorMapEventHandler, BehaviorType, DomEvent } from '@yandex/ymaps3-types';

const resizeHeight = ref(false);
const BEHAVIOR: BehaviorType[] = ['drag', 'scrollZoom', 'dblClick', 'mouseRotate', 'mouseTilt'];

const events = reactive({
  map: {
    update: false,
    resize: false,
  },
  dom: {
    click: false,
    fastClick: false,
    dblClick: false,
    contextMenu: false,
    rightDblClick: false,
    mouseMove: false,
    mouseEnter: false,
    mouseLeave: false,
    mouseUp: false,
    mouseDown: false,
  },
  behavior: {
    scrollZoom: false,
    drag: false,
    mouseRotate: false,
    mouseTilt: false,
  },
});

function debounce<T extends Function>(func: T, delay: number): (...args: any[]) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function _(this: any, ...args: any[]): void {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const createEvent = <T extends keyof typeof events, E = keyof typeof events[T]>(category: T, type: E | boolean): any => {
  const eventState = events[category] as any;

  if (typeof type !== 'boolean') {
    const endEvent = debounce(() => {
      eventState[type] = false;
    }, 250);

    return (object: Record<string, any>, event?: DomEvent) => {
      console.log(`${type} Object: `, object, `\n`, `${type} Event: `, event);

      eventState[type] = true;
      endEvent();
    };
  }
  return (object: Parameters<BehaviorMapEventHandler>[0]) => {
    console.log(`${type ? 'actionStart' : 'actionEnd'} Object:`, object);
    if (!(object.type in events.behavior)) return;

    eventState[object.type] = type;
  };
};
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.events {
  --bg: #fff;
  --color: #111;
  color: var(--color);
}

.events.theme--dark {
  --bg: #111;
  --color: #eee;
}

.events-container, .events-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.events-container {
  pointer-events: all;

  + .events-container {
    margin-left: 10px;
  }
}

.events-block {
  background: var(--bg);
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.events-block_title {
  font-weight: 600;
  border-bottom: 2px solid rgba(150, 150, 150, 0.5);
  padding-bottom: 5px;
  margin-bottom: 5px;
}

.events-block_item {
  background: rgba(150, 150, 150, 0.15);
  padding: 5px;
  border-radius: 5px;
  transition: 0.3s ease-out;
}

.events-block_item--active {
  background: rgba(150, 150, 150, 0.8);
}
</style>
<!-- #endregion style -->
