# Создание полигона

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/ObjectsPolygon.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/ObjectsPolygon.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsPolygon.vue#setup{ts} [Setup]
:::
