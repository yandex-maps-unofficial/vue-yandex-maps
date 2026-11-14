# Асинхронная загрузка JS Map API

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/MapAsync.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/MapAsync.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/MapAsync.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/basics/MapAsync.vue#style{css} [Style]
:::
