# Создание кластеризатора маркеров

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/ManyPoints.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/ManyPoints.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/ManyPoints.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/objects/ManyPoints.vue#style{css} [Style]
:::
