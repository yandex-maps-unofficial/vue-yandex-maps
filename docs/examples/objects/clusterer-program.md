# Создание программного кластеризатора маркеров

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/ManyPointsRenderFunction.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/ManyPointsRenderFunction.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/ManyPointsRenderFunction.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/objects/ManyPointsRenderFunction.vue#style{css} [Style]
:::
