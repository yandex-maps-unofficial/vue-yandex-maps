# World Utils

См. Документацию: https://www.npmjs.com/package/@yandex/ymaps3-world-utils

Поддерживаемые в библиотеке методы:
- `worldToPixels`
- `pixelsToWorld`

## Использование

```typescript
import { worldToPixels, pixelsToWorld } from '@yandex/ymaps3-world-utils';

const pixels = worldToPixels({ x: 0, y: 0 }, 10);
// Returns: { x: 131072, y: 131072 }

const world = pixelsToWorld({ x: 131072, y: 131072 }, 10);
// Returns: { x: 0, y: 0 }
```

::: warning Устаревшие методы
Функции `worldToPixels` и `pixelsToWorld`, экспортируемые из `vue-yandex-maps`, deprecated. Они сохраняют прежний контракт и возвращают `Promise`. Используйте прямой импорт из `@yandex/ymaps3-world-utils`.
:::
