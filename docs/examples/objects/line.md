# Создание линии

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/ObjectsLine.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/ObjectsLine.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsLine.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsLine.vue#style{css} [Style]
:::
