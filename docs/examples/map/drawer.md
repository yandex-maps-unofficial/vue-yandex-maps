# Боковая панель

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/DrawerExample.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/DrawerExample.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/DrawerExample.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/basics/DrawerExample.vue#style{css} [Style]
:::
