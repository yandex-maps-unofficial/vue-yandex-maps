# Кастомные тайлы на canvas

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/layers/CanvasTiles.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/layers/CanvasTiles.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/layers/CanvasTiles.vue#setup{ts} [Setup]
:::
