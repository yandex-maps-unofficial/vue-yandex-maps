# World Utils

См. Документацию: https://www.npmjs.com/package/@yandex/ymaps3-web-mercator-projection

Библиотека экспортирует класс `WebMercator`.

## Способы использования

### Из библиотеки

Под капотом используется `importYmapsCDNModule`.

```typescript
import { WebMercator } from 'vue-yandex-maps';

const projection = new (await WebMercator())();
```

### Импорт из CDN

```typescript
import { importYmapsCDNModule } from 'vue-yandex-maps';

const { WebMercator } = await importYmapsCDNModule('@yandex/ymaps3-web-mercator-projection');

const projection = new WebMercator();
```

### Установить библиотеку

Этот метод может быть опасен. На момент написания доки в библиотеке не было top-level await - но он может появиться.

::: code-group

```shell [npm]
npm install @yandex/ymaps3-web-mercator-projection
```

```shell [yarn]
yarn add @yandex/ymaps3-web-mercator-projection
```

```shell [pnpm]
pnpm install @yandex/ymaps3-web-mercator-projection
```
:::

```typescript
import { WebMercator } from '@yandex/ymaps3-web-mercator-projection';

const projection = new WebMercator();
```

## Примеры использования

```javascript
console.log(projection.toWorldCoordinates([-180, 90])); // {x: -1, y: 1}
console.log(projection.toWorldCoordinates([-180, 85.051])); // ~ {x: -1, y: 1}
console.log(projection.toWorldCoordinates([90, 0])); // ~ {x: 0.5, y: 0}
console.log(projection.toWorldCoordinates([0, -23.6])); // ~ {x: 0, y: -0.135}

console.log(projection.fromWorldCoordinates({x: -1, y: 1})); // ~ [-180, 85.051]
console.log(projection.fromWorldCoordinates({x: 0.5, y: 0})); // [90, 0]
console.log(projection.fromWorldCoordinates({x: 0, y: -0.135})); // ~ [0, -23.6]
```