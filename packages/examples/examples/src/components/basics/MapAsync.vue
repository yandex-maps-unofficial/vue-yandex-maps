<template>
  <common-wrapper>
    <template
      #default="{
        coordinates: center, theme, zoom, width, height,
      }"
    >
      <!-- #region html -->
      <div class="tabs">
        <div class="tabs_header">
          <div
            class="tabs_header_tab"
            :class="{ 'tabs_header_tab--active': tab === 'description' }"
            @click="tab = 'description'"
          >
            Описание
          </div>
          <div class="tabs_header_tab" :class="{ 'tabs_header_tab--active': tab === 'map' }" @click="tab = 'map'">
            Карта
          </div>
        </div>
        <div class="tabs_content">
          <div v-if="tab === 'description'" class="tabs_content_description">
            Скрипты Яндекса подгрузятся, когда вы переключите вкладки сверху - и не секундой раньше!
          </div>
          <yandex-map
            v-else-if="tab === 'map'"
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
          </yandex-map>
        </div>
      </div>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import { YandexMap, YandexMapDefaultSchemeLayer } from 'vue-yandex-maps';
import { ref } from 'vue';

const tab = ref('description');
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.tabs_header {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}

.tabs_header_tab {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  cursor: pointer;
  text-align: center;
  padding: 10px;
  transition: 0.3s;
}

.tabs_header_tab:first-child {
  border-radius: 10px 0 0 10px;
}

.tabs_header_tab:last-child {
  border-radius: 0 10px 10px 0;
}

.tabs_header_tab--active {
  cursor: default;
  background: rgba(255, 255, 255, 0.8);
  color: #000;
}

.tabs_content {
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 15px;
}

.tabs_content_description {
  font-size: 24px;
  text-align: center;
}
</style>
<!-- #endregion style -->
