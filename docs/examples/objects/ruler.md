# Измерения линейкой

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/ObjectsRuler.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/ObjectsRuler.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsRuler.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsRuler.vue#style{css} [Style]
:::
