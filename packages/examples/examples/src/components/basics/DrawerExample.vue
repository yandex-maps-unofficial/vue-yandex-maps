<template>
    <common-wrapper>
        <template
            #default="{
                coordinates: center, theme, zoom, width, height,
            }"
        >
            <!-- #region html -->
            <yandex-map
                :height="height"
                :settings="{
                    location: {
                        center,
                        zoom,
                    },
                    theme,
                    showScaleInCopyrights: true,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-drawer-control :settings="{ position, width: 300, onOpenChange, verticalTriggerPosition, horizontalTriggerPosition, open }">
                    <div class="drawer">
                        <div class="drawer_title">
                            Я - боковая панель!
                        </div>
                        <label v-if="position === 'top' || position === 'bottom'">
                            <select v-model="horizontalTriggerPosition">
                                <option value="left">
                                    Слева
                                </option>
                                <option value="center">
                                    По центру
                                </option>
                                <option value="right">
                                    Справа
                                </option>
                            </select>

                            Позиция открывашки по горизонтали
                        </label>
                        <label v-else>
                            <select v-model="verticalTriggerPosition">
                                <option value="top">
                                    Сверху
                                </option>
                                <option value="center">
                                    По центру
                                </option>
                                <option value="bottom">
                                    Снизу
                                </option>
                            </select>

                            Позиция открывашки по вертикали
                        </label>
                        <label>
                            <select v-model="position">
                                <option value="top">
                                    Сверху
                                </option>
                                <option value="right">
                                    Справа
                                </option>
                                <option value="bottom">
                                    Снизу
                                </option>
                                <option value="left">
                                    Слева
                                </option>
                            </select>

                            Позиция панели
                        </label>
                    </div>
                </yandex-map-drawer-control>
            </yandex-map>
            <!-- #endregion html -->
        </template>
    </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import { YandexMap, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMapDrawerControl } from 'vue-yandex-maps';
import { ref } from 'vue';
import type { Position, VerticalTriggerPosition, HorizontalTriggerPosition } from '@yandex/ymaps3-drawer-control';

const open = ref(true);
const position = ref<Position>('left');
const verticalTriggerPosition = ref <VerticalTriggerPosition>('center');
const horizontalTriggerPosition = ref <HorizontalTriggerPosition>('center');
const onOpenChange = (value: boolean) => {
    open.value = !value;
};

// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.drawer {
  display: flex;
  flex-direction: column;
  padding: 24px;
  color-scheme: light;
  gap: 4px;

  label {
    display: flex;
    gap: 4px;
  }

  select {
    border: 1px solid black;
    border-radius: 4px;
    padding: 4px;
  }
}
</style>
<!-- #endregion style -->
