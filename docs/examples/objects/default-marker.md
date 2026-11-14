# Создание стандартного маркера

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/DefaultMarker.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/DefaultMarker.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/DefaultMarker.vue#setup{ts} [Setup]
:::
