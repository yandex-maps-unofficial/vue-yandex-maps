# Изменение поведений карты

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/basics/MapBehaviors.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/basics/MapBehaviors.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/basics/MapBehaviors.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/basics/MapBehaviors.vue#style{css} [Style]
:::
