# Контекстное меню

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/ContextMenu.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/ContextMenu.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/ContextMenu.vue#setup{ts} [Setup]
:::
