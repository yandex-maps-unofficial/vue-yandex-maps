# Основные параметры

<script lang="ts" setup>
import MapComponent from 'examples/src/components/basics/MapParams.vue';
</script>

<map-component/>

::: info Копируйте с осторожностью
Параметр real-settings-location в примере вызывает изменение геопозиции на каждое изменение settings.

Ознакомьтесь с [документацией компонента YandexMap](/components/map), чтобы узнать больше, зачем он нужен и какие подводные камни.
:::

:::code-group
<<< ../../packages/examples/examples/src/components/basics/MapParams.vue#html{html} [Template]

<<< ../../packages/examples/examples/src/components/basics/MapParams.vue#setup{ts} [Setup]
:::
