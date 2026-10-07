# Мини-карта

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/MiniMap.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/MiniMap.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/MiniMap.vue#setup{ts} [Setup]
:::
