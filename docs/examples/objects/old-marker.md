# Создание старого маркера

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/OldMarker.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/OldMarker.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/OldMarker.vue#setup{ts} [Setup]
:::
