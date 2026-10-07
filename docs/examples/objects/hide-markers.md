# Скрытие маркеров вне зоны видимости

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/HideMarkers.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/HideMarkers.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/HideMarkers.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/objects/HideMarkers.vue#style{css} [Style]
:::
