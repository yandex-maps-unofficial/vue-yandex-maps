# Изменение позиции камеры

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/MapCamera.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/MapCamera.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/MapCamera.vue#setup{ts} [Setup]
:::
