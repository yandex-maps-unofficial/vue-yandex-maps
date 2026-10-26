# Хинт (Подсказки)

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress';
const MapComponent = defineClientComponent(() => import('examples/src/components/objects/MapHint.vue'));
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/MapHint.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/MapHint.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/objects/MapHint.vue#style{css} [Style]
:::
