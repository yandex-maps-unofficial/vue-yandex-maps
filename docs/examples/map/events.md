# Обработка событий карты

:::tip Совет
В консоли разработчика отображается вся информация по сработавшим событиям!
:::

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/MapEvents.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/MapEvents.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/MapEvents.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/basics/MapEvents.vue#style{css} [Style]
:::
