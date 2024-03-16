# Построить маршрут между двумя точками

::: tip Совет
Не забудьте задать `router` в `defaultApikeys` в настройках при инициализации `vue-yandex-maps`, в противном случае метод работать не будет.

Создать ключ API Матрицы Расстояний и Построения маршрута можно в [Кабинете разработчика](https://developer.tech.yandex.ru/services).
:::

<script lang="ts" setup>
import MapComponent from 'examples/src/components/objects/ObjectsRoute.vue';
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/ObjectsRoute.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsRoute.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsRoute.vue#style{css} [Style]
:::
