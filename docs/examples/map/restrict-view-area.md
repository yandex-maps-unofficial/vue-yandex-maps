# Ограничение области просмотра карты

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/RestrictArea.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/RestrictArea.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/RestrictArea.vue#setup{ts} [Setup]
:::
