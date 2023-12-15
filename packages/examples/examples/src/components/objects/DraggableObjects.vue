<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        v-model="map"
        :settings="{
          location: {
            center,
            zoom: 14,
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

        <yandex-map-controls :settings="{ position: 'top left' }">
          <yandex-map-control-button>
            <label>
              <input v-model="draggable" type="checkbox">
              Drag and drop
            </label>
          </yandex-map-control-button>
          <yandex-map-control-button>
            <label>
              Restrictions
              <select v-model="controlMode" :style="{ border: '1px solid #000', paddingLeft: '5px' }">
                <option :value="null">
                  No
                </option>
                <option value="bound">
                  Rectangle
                </option>
                <option value="path">
                  Path
                </option>
              </select>
            </label>
          </yandex-map-control-button>
        </yandex-map-controls>

        <yandex-map-feature v-if="controlMode === 'bound'" :settings="CONTROL_FEATURE" />
        <yandex-map-feature v-else-if="controlMode === 'path'" :settings="CONTROL_LINE_FEATURE" />

        <yandex-map-default-marker
          v-model="marker"
          :settings="{
            draggable,
            mapFollowsOnDrag: true,
            coordinates: markerCoordinates || center,
            onDragEnd: onDragEndMarker,
            onDragMove: onDragMoveMarker,
          }"
        />
        <yandex-map-feature
          :settings="{
            id: DRAGGABLE_FEATURE.id,
            style: DRAGGABLE_FEATURE.style,
            geometry: triangleGeometry,
            draggable,
            onDragEnd: onDragEndTriangle,
            onDragMove: onDragMoveTriangle,
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
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer,
  YandexMapFeature,
  YandexMapZoomControl,
  YandexMapControlButton,
} from 'vue-yandex-maps';
import type { LngLat, YMap, YMapFeatureProps } from '@yandex/ymaps3-types';
import { computed, ref, shallowRef } from 'vue';
import type { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';

const map = shallowRef<YMap | null>(null);
const marker = shallowRef<YMapDefaultMarker | null>(null);
const controlMode = ref<null | 'bound' | 'path'>(null);
const draggable = ref(true);

const markerCoordinates = ref<null | LngLat>(null);

/**
 * Set the coordinates of the bounding rectangle.
 * We will use these coordinates to prohibit moving elements beyond their aisles.
 */
const CONTROL_BOUND = computed<LngLat[]>(() => {
  const p = map.value?.center ?? [0, 0];

  return [
    [p[0] - 0.01, p[1] - 0.01],
    [p[0] + 0.01, p[1] + 0.01],
  ];
});

/**
 * We will set this handler on the onDragMove of the dragged elements.
 * In it, we simply prohibit movement if the cursor goes beyond the CONTROL_BOUND
 * In this handler, we do not control the position of the object when dragging,
 * but only forbid it to go beyond the boundaries of the CONTROL_BOUND area.
 */
const onDragMoveRestrictBound = () => (coords: any) => {
  const coordinates = typeof coords[0] === 'number' ? [coords] : coords;

  return coordinates.every((point: number[]) => {
    if (point[0] < CONTROL_BOUND.value[0][0] || point[0] > CONTROL_BOUND.value[1][0]) {
      return false;
    }

    if (point[1] < CONTROL_BOUND.value[0][1] || point[1] > CONTROL_BOUND.value[1][1]) {
      return false;
    }

    return true;
  });
};

/**
 * Finds the Y coordinate from X on the line [{x1,y1}, {x2,y2}]
 */
const getYFromX = (x: number, [{
  x: x1,
  y: y1,
}, {
  x: x2,
  y: y2,
}]: { x: number, y: number }[]) => {
  const k = (y2 - y1) / (x2 - x1);
  return k * (x - x1) + y1;
};

/**
 * Let's just visually display the border of the bounding box.
 * It has nothing to do with the logic of the constraint.
 */
const CONTROL_FEATURE = computed((): YMapFeatureProps => ({
  id: 'controllableBound',
  geometry: {
    type: 'LineString',
    coordinates: [
      CONTROL_BOUND.value[0],
      [CONTROL_BOUND.value[1][0], CONTROL_BOUND.value[0][1]],
      CONTROL_BOUND.value[1],
      [CONTROL_BOUND.value[0][0], CONTROL_BOUND.value[1][1]],
      CONTROL_BOUND.value[0],
    ],
  },
  style: {
    stroke: [{
      width: 12,
      color: 'rgb(14, 194, 219)',
    }],
  },
}));

/**
 * Polyline on the map, we will use its coordinates to limit the movement of the marker
 */
const CONTROL_LINE_FEATURE: YMapFeatureProps = {
  id: 'controllableLine',
  geometry: {
    type: 'LineString',
    coordinates: [
      [37.609401526506105, 55.74930447117268],
      [37.61327739973231, 55.75379736056805],
      [37.6220752234166, 55.749847949906346],
      [37.63557455612487, 55.75711451069967],
      [37.64627783785714, 55.75054259668716],
    ],
  },
  style: {
    stroke: [{
      width: 12,
      color: 'rgb(219,14,14)',
    }],
  },
};

/**
 * A triangle that will also be draggable
 */
const DRAGGABLE_FEATURE: YMapFeatureProps = {
  id: 'draggableGraphics',
  draggable: true,
  geometry: {
    type: 'LineString',
    coordinates: [
      [37.629082, 55.75254],
      [37.630082, 55.75554],
      [37.625082, 55.75454],
      [37.629082, 55.75254],
    ],
  },
  style: {
    stroke: [{
      width: 8,
      color: 'rgb(128,149,208)',
    }],
  },
};

const triangleCoordinates = ref(DRAGGABLE_FEATURE.geometry.coordinates);

const triangleGeometry = {
  ...DRAGGABLE_FEATURE.geometry,
  coordinates: triangleCoordinates.value,
};

/**
 * The handler will track the movement of the marker and manage it completely independently
 */
const onDragMoveRestrictPath = (setCoordinates: (coordinates: LngLat) => any) => (coords: LngLat) => {
  /**
   * For convenience, we translate the coordinates from the format [lng, Lat] into the format {x: Lng, y: Lat}
   * Please note that we do not change or convert the coordinates in any way.
   * At smaller zoom sizes, these calculations will give large errors.
   * Therefore, in your tasks, convert coordinates to world coordinates using a projection (see YMap.projection)
   */
  const path = CONTROL_LINE_FEATURE.geometry.coordinates.map((c: any) => ({
    x: c[0],
    y: c[1],
  }));
  const coordsW = {
    x: coords[0],
    y: coords[1],
  };

  // Limiting in X to the extreme points of the path
  coordsW.x = Math.max(path[0].x, coordsW.x);
  coordsW.x = Math.min(path[path.length - 1].x, coordsW.x);

  for (let i = 0; i < path.length - 1; i += 1) {
    const line = [path[i], path[i + 1]];

    /**
     * Find the line above which the cursor is now
     */
    if (coordsW.x >= line[0].x && coordsW.x <= line[1].x) {
      coordsW.y = getYFromX(coordsW.x, line);
      break;
    }
  }

  /**
   * We have full control over the position of the marker
   */
  setCoordinates([coordsW.x, coordsW.y]); // We return the coordinates back to the format [Lng, Lat]
  return false;
};

const RESTRICT_HANDLERS = {
  bound: onDragMoveRestrictBound,
  path: onDragMoveRestrictPath,
  '': () => {
  },
};

const onDragEndMarker = () => {
  markerCoordinates.value = marker.value!.coordinates;
};
const onDragMoveMarker = computed(() => controlMode.value && RESTRICT_HANDLERS[controlMode.value]((coordinates) => {
  markerCoordinates.value = coordinates;
}));
const onDragEndTriangle = (coordinates: LngLat) => {
  triangleCoordinates.value = coordinates;
};
const onDragMoveTriangle = computed(() => (controlMode.value === 'bound' ? RESTRICT_HANDLERS[controlMode.value]() : () => {
}));

// #endregion setup
</script>
