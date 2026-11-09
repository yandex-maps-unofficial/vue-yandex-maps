# Указатель на маркеры

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/SignpostExample.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/SignpostExample.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/SignpostExample.vue#setup{ts} [Setup]
:::
