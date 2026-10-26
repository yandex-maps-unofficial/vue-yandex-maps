# YandexMapCartesianProjection

Компонент использует пакет `@yandex/ymaps3-cartesian-projection`, подключённый статическим ESM-импортом, и является
прямоугольной (декартовой) картографической проекцией.

Принимает параметры вместо `settings`:

- `bounds`: `[LngLat, LngLat]`
- `cycled`: `[boolean, boolean]`

::: warning Внимание
Компонент необходимо добавлять только в корне `<yandex-maps>`.
:::

## Пример использования

Декартовая проекция задаёт систему координат, но сама по себе не добавляет фон. Ниже показано подключение растровых тайлов из [примера Яндекса](https://yandex.ru/maps-api/docs/js-api/examples/cases/custom-map.html):

```vue
<template>
    <yandex-map :settings="{ location: { center: [0, 0], zoom: 4 }, mode: 'raster', zoomRange: { min: 3, max: 6 } }">
        <yandex-map-cartesian-projection :bounds="[[-7287.5, -12163.5], [9096.5, 4220.5]]" />
        <yandex-map-tile-data-source :settings="tileSource" />
        <yandex-map-layer :settings="tileLayer" />
        <yandex-map-default-features-layer />
    </yandex-map>
</template>

<script setup lang="ts">
import {
    YandexMap,
    YandexMapCartesianProjection,
    YandexMapDefaultFeaturesLayer,
    YandexMapLayer,
    YandexMapTileDataSource,
} from 'vue-yandex-maps/vapor';
import type { YMapLayerProps, YMapTileDataSourceProps } from '@yandex/ymaps3-types';

const tileSource: YMapTileDataSourceProps = {
    id: 'image',
    copyrights: ['© NASA', '© ESA', '© CSA', '© STScI'],
    raster: {
        type: 'tile',
        fetchTile: 'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/cartesian-projection/tiles/{{z}}/{{y}}-{{x}}.png',
    },
};
const tileLayer: YMapLayerProps = { id: 'image-layer', source: 'image', type: 'tile' };
</script>
```

## Примеры использования

- [Собственная карта](/examples/layers/custom-map)
- [Проекции карты](/examples/map/projections)
