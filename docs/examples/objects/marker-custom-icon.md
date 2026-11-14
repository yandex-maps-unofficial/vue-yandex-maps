# Добавление маркера с пользовательским изображением на карту

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/ObjectsCustomImage.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/ObjectsCustomImage.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsCustomImage.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsCustomImage.vue#style{css} [Style]
:::
