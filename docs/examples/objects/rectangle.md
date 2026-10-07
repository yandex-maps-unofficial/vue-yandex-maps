# Создание прямоугольника

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/ObjectsRectangle.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/ObjectsRectangle.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsRectangle.vue#setup{ts} [Setup]
:::
