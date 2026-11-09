# Перемещение карты

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/MapParams.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/MapParams.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/MapParams.vue#setup{ts} [Setup]
:::
