<template>
  <yandex-map :coordinates="coordinates">
    <yandex-marker :coordinates="coordinates" :marker-id="123">
      <template #component>
        <CustomBalloon v-model="name" />
      </template>
    </yandex-marker>
  </yandex-map>
</template>

<script>
import { ref } from 'vue';
import YandexMap from '../../src/Map';
import YandexMarker from '../../src/Marker';
import CustomBalloon from './CustomBalloon.vue';

export default {
  name: 'YandexMapWrapper',
  components: { YandexMap, YandexMarker, CustomBalloon },
  setup() {
    const coordinates = [55, 33];
    const name = ref('Custom');

    return {
      coordinates,
      name,
    };
  },
};
</script>

<style>
.yandex-container {
  height: 400px;
}

.yandex-balloon {
  height: 200px;
  width: 200px;
}
</style>
