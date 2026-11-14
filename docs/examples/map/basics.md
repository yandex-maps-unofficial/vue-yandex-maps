# Создание карты

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/MapBasics.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/MapBasics.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/MapBasics.vue#setup{ts} [Setup]
:::
