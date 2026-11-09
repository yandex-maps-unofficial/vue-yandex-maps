# Оверлеи

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/layers/BasicOverlay.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/layers/BasicOverlay.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/layers/BasicOverlay.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/layers/BasicOverlay.vue#style{css} [Style]
:::
