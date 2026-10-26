# Загрузчик

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/SpinnerExample.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/SpinnerExample.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/SpinnerExample.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/basics/SpinnerExample.vue#style{css} [Style]
:::
