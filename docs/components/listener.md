# YandexMapListener

Компонент принимает в `settings` `YandexMapListenerSettings` и позволяет прослушивать события на карте. 

Документация по доступным событиям: https://yandex.ru/dev/jsapi30/doc/ru/dg/concepts/events#list-of-events

```vue
<template>
  <yandex-map>
    <yandex-map-default-features-layer/>
    <yandex-map-listener :settings="{ onClick: logMapClick }" />
  </yandex-map>
</template>

<script setup lang="ts">
import { YandexMap, YandexMapDefaultFeaturesLayer, YandexMapListener } from 'vue-yandex-maps';
import { DomEventHandler } from '@yandex/ymaps3-types';

//В object содержится объект, на который кликнули. В клике по месту на карте его нет
const logMapClick: DomEventHandler = (object, event) => console.log(object, event);
</script>
```
## Примеры использования

- [Обработка событий карты](/examples/map/events)
