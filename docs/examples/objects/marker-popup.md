# Попап при клике на маркер

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/MarkerPopup.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/MarkerPopup.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/MarkerPopup.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/objects/MarkerPopup.vue#style{css} [Style]
:::
