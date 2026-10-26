# Cartesian Projection

См. Документацию: https://www.npmjs.com/package/@yandex/ymaps3-cartesian-projection

## Использование

```typescript
import { Cartesian } from '@yandex/ymaps3-cartesian-projection';

const projection = new Cartesian([
    // these boundaries define the limits of the world map in the Cartesian coordinate system.
    [-400, -600],
    [400, 600],
]);
```

::: warning Устаревший метод
Функция `Cartesian`, экспортируемая из `vue-yandex-maps`, deprecated. Используйте прямой импорт класса из `@yandex/ymaps3-cartesian-projection`.
:::

## Примеры использования

```javascript
console.log(projection.toWorldCoordinates([-400, 600])) // {x: -1, y: 1}
console.log(projection.toWorldCoordinates([200, 0])) // {x: 0.5, y: 0}
console.log(projection.toWorldCoordinates([0, -75])) // {x: 0, y: -0.125}

console.log(projection.fromWorldCoordinates({x: -1, y: 1})) // [-400, 600]
console.log(projection.fromWorldCoordinates({x: 0.5, y: 0})) // [200, 0]
console.log(projection.fromWorldCoordinates({x: 0, y: -0.125})) // [0, -75]
```
