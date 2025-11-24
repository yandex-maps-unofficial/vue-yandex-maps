# World Utils

См. Документацию: https://www.npmjs.com/package/@yandex/ymaps3-world-utils

Поддерживаемые в библиотеке методы:
- `worldToPixels`
- `pixelsToWorld`

## Способы использования

### Из библиотеки

Под капотом используется `importYmapsCDNModule`.

```typescript
import { worldToPixels, pixelsToWorld } from 'vue-yandex-maps';

const pixels = worldToPixels({ x: 0, y: 0 }, 10);
// Returns: Promise<{ x: 131072, y: 131072 }>

const world = pixelsToWorld({ x: 131072, y: 131072 }, 10);
// Returns: Promise<{ x: 0, y: 0 }>
```

### Импорт из CDN

```typescript
import { importYmapsCDNModule } from 'vue-yandex-maps';

const { worldToPixels, pixelsToWorld } = await importYmapsCDNModule('@yandex/ymaps3-world-utils');

const pixels = worldToPixels({ x: 0, y: 0 }, 10);
// Returns: Promise<{ x: 131072, y: 131072 }>

const world = pixelsToWorld({ x: 131072, y: 131072 }, 10);
// Returns: Promise<{ x: 0, y: 0 }>
```

### Установить библиотеку

Этот метод может быть опасен. На момент написания доки в библиотеке не было top-level await - но он может появиться.

::: code-group

```shell [npm]
npm install @yandex/ymaps3-world-utils
```

```shell [yarn]
yarn add @yandex/ymaps3-world-utils
```

```shell [pnpm]
pnpm install @yandex/ymaps3-world-utils
```
:::

```typescript
import { worldToPixels, pixelsToWorld } from '@yandex/ymaps3-world-utils';

const pixels = worldToPixels({ x: 0, y: 0 }, 10);
// Returns: Promise<{ x: 131072, y: 131072 }>

const world = pixelsToWorld({ x: 131072, y: 131072 }, 10);
// Returns: Promise<{ x: 0, y: 0 }>
```
