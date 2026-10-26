# Элементы управления

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/MapControls.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/MapControls.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/MapControls.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/basics/MapControls.vue#style{css} [Style]
:::
