# Поиск и Геосаджест

::: tip Совет
Не забудьте задать `suggest` в `defaultApikeys` в настройках при инициализации `vue-yandex-maps`, в противном случае метод работать не будет.

Создать ключ API Геосаджеста можно в [Кабинете разработчика](https://developer.tech.yandex.ru/services).

`ymaps3.search` авторизации не требует, только `ymaps3.suggest`.
:::

<script lang="ts" setup>
import MapComponent from 'examples/src/components/objects/ObjectsSearch.vue';
</script>

<map-component/>

:::code-group
<<< ../../../packages/examples/examples/src/components/objects/ObjectsSearch.vue#html{html} [Template]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsSearch.vue#setup{ts} [Setup]

<<< ../../../packages/examples/examples/src/components/objects/ObjectsSearch.vue#style{css} [Style]
:::
