<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        :settings="{
          location: {
            center,
            zoom,
          },
          theme,
          showScaleInCopyrights: true,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>

        <yandex-map-controls :settings="{ position: 'top left' }">
          <yandex-map-control-button>
            <label>
              Position (X)

              <select v-model="positionX">
                <option v-for="(key, value) in positionsX" :key="key" :value="value">
                  {{ key }}
                </option>
              </select>
            </label>
          </yandex-map-control-button>
          <yandex-map-control-button>
            <label>
              Position (Y)

              <select v-model="positionY">
                <option v-for="(key, value) in positionsY" :key="key" :value="value">
                  {{ key }}
                </option>
              </select>
            </label>
          </yandex-map-control-button>
        </yandex-map-controls>

        <template v-for="(point, index) in POINTS" :key="index">
          <yandex-map-marker
            v-if="'element' in point"
            :settings="point"
            :position="`${positionX} ${positionY}` as any"
            :style="{
              '--color': 'color' in point && point.color,
              '--image': 'colors' in point && diagramBackground(point.colors),
            }"
          >
            <template v-if="point.element === 'diagram'">
              <div
                v-if="'title' in point"
                class="pie-marker-title"
              >
                {{ point.title }}
              </div>
              <div
                class="pie-marker"
              />
            </template>
            <div
              v-else-if="point.element === 'circle'"
              class="circle"
              :style="{
                '--radius': 'radius' in point ? point.radius : '20px',
                '--color': 'color' in point ? point.color : undefined,
                '--icon': 'icon' in point ? point.icon : '#fff',
                '--image': 'icon' in point ? point.icon : undefined,
              }"
              :title="'title' in point && point.title"
            >
              <div class="circle_element" />
            </div>
            <div
              v-else-if="point.element === 'icon'"
              class="icon"
              :style="{
                '--size': 'size' in point ? point.size : '20px',
                '--color': 'color' in point ? point.color : undefined,
                '--icon': 'icon' in point ? `url(${point.icon})` : undefined,
              }"
            >
              <div
                v-if="'title' in point"
                class="icon_title"
                v-html="point.title"
              />
            </div>
          </yandex-map-marker>
          <yandex-map-default-marker
            v-else
            :settings="point"
          />
        </template>
        <yandex-map-default-marker :settings="{ coordinates: INC_POINT.coordinates, title: markerTitle }" />
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
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker,
  YandexMapControlButton,
  YandexMapZoomControl,
} from 'vue-yandex-maps';
import type { YandexMapMarkerPosition } from 'vue-yandex-maps';
import { onMounted, onUnmounted, ref } from 'vue';
import type { LngLat } from '@yandex/ymaps3-types';

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

const INC_POINT = {
  coordinates: [37.95, 55.9] as LngLat,
  title: 'Marker inc #0',
};

const markerTitle = ref('');

const positionsX = {
  left: 'left',
  right: 'right',
  'right-center': 'right-center',
  'left-center': 'left-center',

  custom: '-25%',

  default: 'default',
} satisfies PartialRecord<YandexMapMarkerPosition | 'custom', string>;

const positionsY = {
  top: 'top',
  bottom: 'bottom',
  'top-center': 'top-center',
  'bottom-center': 'bottom-center',

  custom: '-25%',

  default: 'default',
} satisfies PartialRecord<YandexMapMarkerPosition | 'custom', string>;

const positionX = ref<keyof typeof positionsX>('default');
const positionY = ref<keyof typeof positionsY>('default');

onMounted(() => {
  let inc = 0;
  const updateTitle = () => {
    inc++;
    markerTitle.value = `Marker inc #${inc}`;
  };
  updateTitle();
  const timer = setInterval(updateTitle, 1000);
  onUnmounted(() => {
    clearInterval(timer);
  });
});

const diagramBackground = (colors: { percentage: number, color: string }[]): string => {
  const gradient = [];
  let previous = 0;
  for (let i = 0; i < colors.length; i += 1) {
    const p = colors[i];
    const deg = (360 / 100) * p.percentage;
    gradient.push(`${p.color} ${previous}deg ${previous + deg}deg`);
    previous += deg;
  }

  return `conic-gradient(${gradient.join(', ')})`;
};

const POINTS: any[] = [
  { coordinates: [37.8, 55.8] },
  {
    coordinates: [37.6, 55.847],
    title: 'Diagram',
    color: '#0E4779',
    draggable: true,
    colors: [
      {
        percentage: 30,
        color: '#0E4779',
      },
      {
        percentage: 20,
        color: '#1E98FF',
      },
      {
        percentage: 40,
        color: '#82CDFF',
      },
      {
        percentage: 10,
        color: '#ff9f82',
      },
    ],
    element: 'diagram',
  },
  {
    coordinates: [37.738521, 55.684758],
    color: '#0095b6',
    title: 'color <strong>bondi beach water<strong>',
    draggable: true,
  },
  {
    coordinates: [37.715175, 55.833436],
    color: '#735184',
    title: '<strong>Silver crimson<strong> color',
    draggable: true,
  },
  {
    coordinates: [37.529789, 55.687086],
    color: '#3caa3c',
    title: 'love toad color',
    draggable: true,
    element: 'circle',
  },
  {
    coordinates: [37.95, 55.782392],
    color: 'yellow',
    title: 'color <strong>sun<strong>',
    draggable: true,
    onClick: () => alert('click'),
  },
  {
    coordinates: [37.656123, 55.642063],
    title: 'color <strong>red<strong>',
    size: '60px',
    icon: 'data:image/png;base64,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',
    draggable: true,
    element: 'icon',
    onDoubleClick: () => alert('Double click'),
  },
  {
    coordinates: [37.487208, 55.826479],
    title: 'the color of <strong>Pacific Ocean<strong>',
    color: '#3b5998',
    draggable: true,
    mapFollowsOnDrag: true,
  },
  {
    coordinates: [37.435023, 55.694843],
    color: '#477510',
    title: 'nose color Donatello',
    subtitle: 'Very long but incredibly interesting text',
    draggable: true,
  },
  {
    coordinates: [37.535023, 55.6],
    color: '#343d44',
    title: 'Hello!',
    subtitle: 'Very long but <br>incredibly interesting text',
    draggable: true,
  },
  {
    coordinates: [37.814052, 55.790139],
    title: 'blue color',
    icon: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiI+PHBhdGggZmlsbD0iIzgwODI4NSIgZD0iTTEyLjc0IDUuNzlWMy40N2wtNS44IDEuMTZINS4yMnYxMy45aDEuNzR2LTYuOTVsMy40Ny0uNTh2Mi4zMmw3LjUzLS41OHYtNy42bC01LjIxLjY1eiIvPjwvc3ZnPg==)',
    color: '#51aabd',
    radius: '50px',
    draggable: true,
    element: 'circle',
    onFastClick: () => alert('Fast click'),
  },
];

// #endregion setup
</script>

<!-- #region style -->
<style scoped>
select {
  border: 1px solid #000;
  padding-left: 5px;
}

.pie-marker-title {
  position: absolute;
  top: 120%;
  left: 50%;
  padding: 2px 4px;
  background-color: #fff;
  transform: translateX(-50%);
  color: var(--color);
}

.pie-marker {
  background-color: currentColor;
  background-image: var(--image);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.circle {
  width: var(--radius);
  height: var(--radius);
  border-radius: 50%;
  background-color: currentColor;
  color: var(--color);
}

.circle_element {
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background: #fff var(--image) no-repeat center center;
  transform: translate3d(-50%, -50%, 0);
}

.icon {
  position: relative;
  width: var(--size);
  height: var(--size);
  color: var(--color);
  background: var(--icon) no-repeat center center / contain;
}

.icon_title {
  position: absolute;
  top: 120%;
  left: 50%;
  padding: 2px 4px;
  background-color: #fff;
  transform: translateX(-50%);
}
</style>
<!-- #endregion style -->
