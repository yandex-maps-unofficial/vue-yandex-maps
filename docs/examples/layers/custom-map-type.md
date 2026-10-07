# Свой источник данных

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/layers/CustomMapType.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/layers/CustomMapType.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/layers/CustomMapType.vue#setup{ts} [Setup]
:::
