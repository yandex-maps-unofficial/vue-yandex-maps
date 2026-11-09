# Проекции карты

В одном примере сравниваются Web Mercator и декартова проекция. На картах показаны результаты преобразований координат в мировые и пиксельные, а также обратное преобразование.

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/MapProjections.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/MapProjections.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/MapProjections.vue#setup{ts} [Setup]
:::
