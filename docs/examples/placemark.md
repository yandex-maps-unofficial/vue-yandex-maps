# Добавление метки на карту

<script lang="ts" setup>
import MapComponent from 'examples/src/components/objects/ObjectsPlacemark.vue';
</script>

<map-component/>

::: tip Совет
Чтобы поведение обычных маркеров соответствовало Yandex Maps 2, задайте:
- `positionX` на `left-center`
- `positionY` на `top`.

`position` будет сформирован как `left-center top`.
:::

:::code-group
<<< ../../packages/examples/examples/src/components/objects/ObjectsPlacemark.vue#html{html} [Template]

<<< ../../packages/examples/examples/src/components/objects/ObjectsPlacemark.vue#setup{ts} [Setup]
:::
