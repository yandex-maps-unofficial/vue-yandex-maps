# Web Mercator Projection

См. Документацию: https://www.npmjs.com/package/@yandex/ymaps3-web-mercator-projection

## Использование

```typescript
import { WebMercator } from '@yandex/ymaps3-web-mercator-projection';

const projection = new WebMercator();
```

::: warning Устаревший метод
Функция `WebMercator`, экспортируемая из `vue-yandex-maps`, deprecated. Используйте прямой импорт класса из `@yandex/ymaps3-web-mercator-projection`.
:::

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
