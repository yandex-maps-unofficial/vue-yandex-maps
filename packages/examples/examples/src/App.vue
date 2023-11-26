<script lang="ts">
import { defineComponent } from 'vue';
import MapParams from './components/basics/MapParams.vue';

export default defineComponent({
  components: {
    MapParams,
  },
});
</script>

<template>
  <map-params />
</template>

<style>
html, body {
  width: 100%;
  height: 100%;
}
</style>
