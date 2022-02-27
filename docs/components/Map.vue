<template>
  <yandex-map :coordinates="[55, 33]">
    <slot></slot>
  </yandex-map>
</template>

<script>
import YandexMap from '../../src/Map';

export default {
  name: 'YandexMapWrapper',
  components: { YandexMap },
};
</script>

<style>
.yandex-container {
  height: 300px;
}
</style>
