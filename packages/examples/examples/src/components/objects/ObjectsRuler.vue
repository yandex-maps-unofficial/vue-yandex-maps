<template>
    <div>
        <common-wrapper>
            <template
                #default="{
                    theme, width, height,
                }"
            >
                <!-- #region html -->
                <yandex-map
                    :height="height"
                    :settings="{
                        location: LOCATION,
                        theme,
                        showScaleInCopyrights: true,
                    }"
                    :width="width"
                >
                    <yandex-map-default-scheme-layer/>
                    <yandex-map-default-features-layer/>
                    <yandex-map-controls :settings="{ position: 'top left' }">
                        <yandex-map-control>
                            <label class="editable">
                                editable
                                <input
                                    v-model="editable"
                                    type="checkbox"
                                >
                            </label>
                            <label>
                                Режим

                                <select v-model="mode">
                                    <option value="ruler">
                                        ruler
                                    </option>
                                    <option value="planimeter">
                                        planimeter
                                    </option>
                                </select>
                            </label>
                        </yandex-map-control>
                    </yandex-map-controls>

                    <yandex-map-controls :settings="{ position: 'top right' }">
                        <yandex-map-control>
                            <div class="info">
                                {{ totalLabel }}
                            </div>
                        </yandex-map-control>
                    </yandex-map-controls>

                    <yandex-map-ruler
                        v-model:points-state="state"
                        :settings="{
                            type: mode,
                            points: RULER_COORDINATES,
                            editable,
                            geometry: { style: FEATURE_STYLE } ,
                            onUpdate: setTotalLabel,
                        }"
                    >
                        <template #point="{ state: pointState, onDelete }">
                            <div
                                class="point"
                                :class="{ 'point--last': pointState.index === pointState.totalCount - 1 }"
                                @click="($event.target as HTMLElement).classList.toggle('point--active')"
                            >
                                <div class="point_popup">
                                    {{ getLabel(pointState) }}

                                    <div
                                        class="point_popup_delete"
                                        @click.stop.prevent="onDelete()"
                                    >
                                        Удалить точку
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template #previewPoint>
                            <div class="point point--preview"/>
                        </template>
                    </yandex-map-ruler>
                </yandex-map>
                <!-- #endregion html -->
            </template>
        </common-wrapper>
        <textarea
            readonly
            :value="JSON.stringify(state, undefined, 2)"
        />
    </div>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
import type { DrawingStyle, LngLat } from '@yandex/ymaps3-types';
// #region setup
import { YandexMap, YandexMapControls, YandexMapDefaultFeaturesLayer, YandexMapDefaultSchemeLayer, YandexMapControl, YandexMapRuler } from 'vue-yandex-maps';
import { ref, shallowRef } from 'vue';
import type { YandexMapRulerSettings } from 'vue-yandex-maps';
import type { YMapLocationRequest } from '@yandex/ymaps3-types/imperative/YMap';
import type { RulerCommonState, RulerPointState } from '@yandex/ymaps3-types/modules/ruler/YMapRulerCommon';
import type { RenderPointArgs } from '@yandex/ymaps3-types/modules/ruler/YMapRuler';

const editable = ref(true);
const mode = ref<YandexMapRulerSettings['type']>('ruler');
const totalLabel = ref('');
const state = shallowRef<RenderPointArgs[]>([]);

const FEATURE_STYLE: DrawingStyle = {
    simplificationRate: 0,
    fill: '#666',
    fillOpacity: 0.3,
    stroke: [
        { width: 3, opacity: 0.7, color: '#666' },
        { width: 5, opacity: 0.7, color: '#fff' },
    ],
};

function formatDistance(distance: number): string {
    return distance > 900 ? `${ roundDistance(distance / 1000) } km` : `${ roundDistance(distance) } m`;
}

function formatArea(area: number): string {
    return area > 900_000
        ? `${ splitNumber(roundDistance(area / 1_000_000)) } km²`
        : `${ splitNumber(roundDistance(area)) } m²`;
}

function roundDistance(distance: number): number {
    if (distance > 100) {
        return Math.round(distance);
    }
    const factor = Math.pow(10, distance > 10 ? 1 : 2);
    return Math.round(distance * factor) / factor;
}

function splitNumber(value: number): string {
    return value.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
}

function setTotalLabel(state: RulerCommonState) {
    totalLabel.value = state.measurements.type === 'ruler'
        ? `Total distance: ${ formatDistance(state.measurements.totalDistance) }`
        : `Area: ${ formatArea(state.measurements.area) }`;
}

function getLabel(state: RulerPointState) {
    return state.measurements.type === 'ruler'
        ? formatDistance(state.measurements.distance)
        : formatArea(state.measurements.area);
}

const LOCATION: YMapLocationRequest = {
    center: [31.245384, 30.051434], // starting position [lng, lat]
    zoom: 3, // starting zoom
};

const RULER_COORDINATES: LngLat[] = [
    [-0.128407, 51.506807], // London
    [31.245384, 30.051434], // Cairo
    [77.201224, 28.614653], // New Delhi
];
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.editable {
  &, ~ * {
    padding: 5px;
    display: inline-block;
  }
}

.info {
  padding: 5px;
}

select {
  border: 1px solid currentColor;
  border-radius: 4px;
  padding: 5px;
}

.point {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  cursor: pointer;
  background: green;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &.point--preview {
    background: red;
  }

  .point_popup {
    display: none;
  }

  &.point--active, &.point--last {
    .point_popup {
      display: flex;
      gap: 8px;
      align-items: center;
      position: absolute;
      bottom: calc(100% + 10px);
      background: #fff;
      white-space: nowrap;
      font-size: 12px;
      padding: 5px;
      border-radius: 8px;
      cursor: default;

      .point_popup_delete {
        background: #ccc;
        border-radius: 4px;
        cursor: pointer;
        padding: 2px 10px;
      }
    }
  }
}

textarea {
  width:100%;
  height: 300px;
}
</style>
<!-- #endregion style -->
