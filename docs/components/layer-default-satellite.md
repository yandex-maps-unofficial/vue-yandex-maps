# YandexMapDefaultSatelliteLayer

Компонент принимает в `settings` [YandexMapDefaultSatelliteLayer](https://yandex.ru/dev/jsapi30/doc/ru/ref/#YMapDefaultSatelliteLayerProps) и меняет слой карты на спутник.

Использовать `<yandex-map-default-scheme-layer>` при использовании этого компонента, кажется, не обязательно.

::: danger Обратите внимание
Официально этот компонент Яндексом не документирован, а в одном из обновлений компонент был удалён из типизации.

Используйте его на свой страх и риск. В любой момент Яндекс может удалить его из SDK.
:::

::: warning Важно
Слой Спутника важно добавлять при инициализации карты - в противном случае он перекроет объекты карты.
:::

## Пример использования

<script lang="ts" setup>
import MapComponent from 'examples/src/components/layers/SatelliteLayer.vue';
</script>

<map-component/>

:::code-group
<<< ../../packages/examples/examples/src/components/layers/SatelliteLayer.vue#html{html} [Template]

<<< ../../packages/examples/examples/src/components/layers/SatelliteLayer.vue#setup{ts} [Setup]
:::
