# Создание и удаление карты

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/HiddenDiv.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/HiddenDiv.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/HiddenDiv.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/basics/HiddenDiv.vue#style{css} [Style]
:::
