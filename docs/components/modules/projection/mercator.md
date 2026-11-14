# YandexMapWebMercatorProjection

Компонент использует пакет `@yandex/ymaps3-web-mercator-projection`, подключённый статическим ESM-импортом, и включает
равноугольную цилиндрическую проекцию Меркатора.

Параметров не принимает, кроме стандартного `v-model`.

::: warning Внимание
Компонент необходимо добавлять только в корне `<yandex-maps>`.
:::

## Пример использования

Web Mercator можно использовать со стандартным слоем схемы:

```vue
<template>
    <yandex-map :settings="{ location: { center: [37.6173, 55.7558], zoom: 10 } }">
        <yandex-map-web-mercator-projection />
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
    </yandex-map>
</template>

<script setup lang="ts">
import {
    YandexMap,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSchemeLayer,
    YandexMapWebMercatorProjection,
} from 'vue-yandex-maps/vapor';
</script>
```

## Примеры использования

- [Свой источник данных](/examples/layers/custom-map-type)
- [Проекции карты](/examples/map/projections)
