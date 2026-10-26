# Перетаскивание объектов

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/DraggableMarker.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/DraggableMarker.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/DraggableMarker.vue#setup{ts} [Setup]
:::
