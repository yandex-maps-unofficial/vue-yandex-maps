<template>
  <yandex-map :coordinates="coordinates" :detailed-controls="detailedControls" :controls="controls" map-type="hybrid" />
</template>

<script>
import YandexMap from '../../src/Map';

export default {
  name: 'YandexMapWrapper',
  components: { YandexMap },
  setup() {
    const coordinates = [55, 33];
    const controls = ['fullscreenControl'];
    const detailedControls = { zoomControl: { position: { right: 10, top: 50 } } };

    return {
      coordinates,
      controls,
      detailedControls,
    };
  },
};
</script>

<style>
.yandex-container {
  height: 400px;
}
</style>
