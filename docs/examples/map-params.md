# Основные параметры

<script lang="ts" setup>
import MapComponent from 'examples/src/components/basics/MapParams.vue';
</script>

<map-component/>

> [!IMPORTANT] Копируйте с осторожностью
> Параметр real-settings-location в примере вызывает изменение геопозиции на каждое изменение settings.
> 
> Ознакомьтесь с [документацией компонента YandexMap](/components/map), чтобы узнать больше, зачем он нужен и какие подводные камни.

::: warning Слой Спутника
Обратите внимание на `key` на карте для `satellite`. Слой Спутника важно добавлять при инициализации карты - в противном случае он перекроет объекты карты.
:::

:::code-group
<<< ../../packages/examples/examples/src/components/basics/MapParams.vue#html{html} [Template]

<<< ../../packages/examples/examples/src/components/basics/MapParams.vue#setup{ts} [Setup]
:::
