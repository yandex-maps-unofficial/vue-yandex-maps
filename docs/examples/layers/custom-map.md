# Создание собственной карты

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/layers/CreateCustomMap.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/layers/CreateCustomMap.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/layers/CreateCustomMap.vue#setup{ts} [Setup]
:::
