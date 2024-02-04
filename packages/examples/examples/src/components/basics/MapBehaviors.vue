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
          behaviors: enabledBehaviors,
        }"
        :width="width"
        :height="height"
        :cursor-grab="enabledBehaviors.includes('drag')"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-controls :settings="{ position: 'right top', orientation: 'vertical' }">
          <yandex-map-control>
            <div class="behaviors">
              <label
                v-for="(_, behavior) in allBehaviors"
                :key="behavior"
              >
                <input
                  type="checkbox"
                  :checked="enabledBehaviors.includes(behavior)"
                  @input="!enabledBehaviors.includes(behavior) ? enabledBehaviors.push(behavior) : enabledBehaviors = enabledBehaviors.filter(x => x !== behavior)"
                >
                {{ behavior }}
              </label>
            </div>
          </yandex-map-control>
          <yandex-map-control>
            <div class="behaviors">
              Для проверки работы mouseRoute/mouseTilt, удерживайте CTRL+ЛКМ по карте
            </div>
          </yandex-map-control>
        </yandex-map-controls>
      </yandex-map>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import { ref } from 'vue';
import {
  YandexMap, YandexMapControl, YandexMapControls, YandexMapDefaultSchemeLayer,
} from 'vue-yandex-maps';
import type { BehaviorType } from '@yandex/ymaps3-types';

// Аналогично включены по умолчанию в самой Яндекс Карте
const enabledBehaviors = ref<BehaviorType[]>(['drag', 'scrollZoom', 'pinchZoom', 'dblClick']);

const allBehaviors: Record<BehaviorType, true> = {
  dblClick: true,
  drag: true,
  scrollZoom: true,
  mouseRotate: true,
  mouseTilt: true,
  magnifier: true,
  oneFingerZoom: true,
  panTilt: true,
  pinchRotate: true,
  pinchZoom: true,
};
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.behaviors {
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  font-size: 14px;
}
</style>
<!-- #endregion style -->
