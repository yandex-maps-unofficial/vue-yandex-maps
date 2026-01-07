# World Utils

См. Документацию: https://www.npmjs.com/package/@yandex/ymaps3-cartesian-projection

Библиотека экспортирует класс `Cartesian`.

## Способы использования

### Из библиотеки

Под капотом используется `importYmapsCDNModule`.

```typescript
import { Cartesian } from 'vue-yandex-maps';

const projection = new (await Cartesian())([
    // these boundaries define the limits of the world map in the Cartesian coordinate system.
    [-400, -600],
    [400, 600],
]);
```

### Импорт из CDN

```typescript
import { importYmapsCDNModule } from 'vue-yandex-maps';

const { Cartesian } = await importYmapsCDNModule('@yandex/ymaps3-cartesian-projection');

const projection = new Cartesian([
    // these boundaries define the limits of the world map in the Cartesian coordinate system.
    [-400, -600],
    [400, 600],
]);
```

### Установить библиотеку

Этот метод может быть опасен. На момент написания доки в библиотеке не было top-level await - но он может появиться.

::: code-group

```shell [npm]
npm install @yandex/ymaps3-cartesian-projection
```

```shell [yarn]
yarn add @yandex/ymaps3-cartesian-projection
```

```shell [pnpm]
pnpm install @yandex/ymaps3-cartesian-projection
```
:::

```typescript
import { Cartesian } from '@yandex/ymaps3-cartesian-projection';

const projection = new Cartesian([
    // these boundaries define the limits of the world map in the Cartesian coordinate system.
    [-400, -600],
    [400, 600],
]);
```

## Примеры использования

```javascript
console.log(projection.toWorldCoordinates([-400, 600])) // {x: -1, y: 1}
console.log(projection.toWorldCoordinates([200, 0])) // {x: 0.5, y: 0}
console.log(projection.toWorldCoordinates([0, -75])) // {x: 0, y: -0.125}

console.log(projection.fromWorldCoordinates({x: -1, y: 1})) // [-400, 600]
console.log(projection.fromWorldCoordinates({x: 0.5, y: 0})) // [200, 0]
console.log(projection.fromWorldCoordinates({x: 0, y: -0.125})) // [0, -75]
```