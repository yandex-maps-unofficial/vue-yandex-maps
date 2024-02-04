<template>
  <common-wrapper>
    <template
      #default="{
        theme, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        v-model="map"
        :settings="{
          location: {
            bounds: restrictArea,
          },
          zoomRange,
          restrictMapArea: restrictArea,
          theme,
        }"
        :width="width"
        :height="height"
        readonly-settings
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />

        <yandex-map-feature
          :settings="{
            geometry: {
              type: 'Polygon',
              coordinates: [boundsToPolygonCoordinates(restrictArea)],
            },
            style: {
              stroke: [{ width: 12, color: '#007afce6' }],
              fill: 'rgba(0, 0, 0, 0)',
            },
          }"
        />

        <yandex-map-controls :settings="{ position: 'bottom' }">
          <yandex-map-control-button :settings="{ onClick: () => bigFov = !bigFov }">
            <template v-if="bigFov">
              Сократить поле видимости
            </template>
            <template v-else>
              Расширить поле видимости
            </template>
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
  YandexMapFeature,
} from 'vue-yandex-maps';
import type {
  LngLat, LngLatBounds, YMap, ZoomRange,
} from '@yandex/ymaps3-types';
import {
  computed, ref, shallowRef, watch,
} from 'vue';

const bigFov = ref(false);
const map = shallowRef<YMap | null>(null);

const LITTLE_ZOOM_RANGE: ZoomRange = {
  min: 14,
  max: 20,
};
const BIG_ZOOM_RANGE: ZoomRange = {
  min: 7,
  max: 14,
};

// Bounding box - bottom left and top right corners
const LITTLE_RESTRICT_AREA: LngLatBounds = [
  [37.523, 55.702],
  [37.723, 55.802],
];
const BIG_RESTRICT_AREA: LngLatBounds = [
  [26.298, 47.019],
  [48.28, 64.453],
];

const restrictArea = computed(() => (bigFov.value ? BIG_RESTRICT_AREA : LITTLE_RESTRICT_AREA));
const zoomRange = computed(() => (bigFov.value ? BIG_ZOOM_RANGE : LITTLE_ZOOM_RANGE));

// Изначально это планировалось сделать реактивным, но Яндекс сходит с ума, если менять это одновременно через один большой update
watch(bigFov, () => {
  // И порядок должен быть именно такой, с другим не работает :)
  map.value!.update({
    zoomRange: zoomRange.value,
    restrictMapArea: restrictArea.value,
  });
  map.value!.update({
    location: {
      bounds: restrictArea.value,
    },
  });
});

// From the coordinates of bottom left and top right corners, we make 4 coordinates of the rectangle
function boundsToPolygonCoordinates(bounds: LngLatBounds): LngLat[] {
  return [bounds[0], [bounds[1][0], bounds[0][1]], bounds[1], [bounds[0][0], bounds[1][1]]];
}

// #endregion setup
</script>
