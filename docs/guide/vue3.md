---
next:
  text: 'Конфигурация'
  link: '/guide/configuration'
---

# Установка на Vue 3 / Nuxt 3 / Astro

## Установите пакет

::: warning Внимание
Минимальная версия `Vue` - 3.3, а при использовании TS `vue-tsc` должен быть 1.5 и выше.

Рекомендуется использовать последние версии обеих вышеупомянутых зависимостей.
:::

::: code-group

```shell [npm]
npm install vue-yandex-maps
```

```shell [yarn]
yarn add vue-yandex-maps
```

```shell [pnpm]
pnpm install vue-yandex-maps
```

:::

::: details Решение проблем с TypeScript
После установки, если у вас стоит старая версия Vue, может не работать автокомплит пропсов.

Для исправления:
- Обновите версию Vue
- Обновите версию `vue-tsc`
- Обновите локфайл/зависимости (удалите node_modules, lock-файл, и сделайте install)
:::

## Подключение

::: tip Совет
Параллельно с apiKey на примерах ниже, в тех же объектах доступны все параметры
из [раздела Конфигурация](/guide/configuration).
:::

### Vue 3

В основном файле (например, main.ts) подключите Карты:

::: code-group

```typescript{2,7-9} [main.ts]
import { createApp } from 'vue';
import { createYmaps } from 'vue-yandex-maps';
import App from './App.vue';

const app = createApp(App);

app.use(createYmaps({
  apikey: 'your-api-key',
}));

app.mount('#app');
```

:::

#### Настройка для TypeScript
Для более удобной работы с Картами вы также можете добавить пакет Карт в typeRoots вашего `tsconfig.json`. 

```json {}
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@yandex/ymaps3-types"
    ]
  }
}
```

В Nuxt 3 это добавляется автоматически.

### Astro

1. Укажите `appEntrypoint` в Astro Config
    ```typescript
    import { defineConfig } from 'astro/config';
    import vue from '@astrojs/vue';  // [!code focus]
    //...
    
    // https://astro.build/config
    export default defineConfig({
      integrations: [vue({ appEntrypoint: '/src/init' })],  // [!code focus]
      //...
    });
    ```
2. В вашем файлике (в нашем случае: `src/init.ts`) подключите пакет по аналогии с указанным выше:
    ```typescript
    import type { App } from 'vue';
    import { createYmaps } from 'vue-yandex-maps';
    
    export default (app: App) => {
      app.use(createYmaps({
        apikey: 'your-api-key',
      }));
    };
    ```
3. Опционально, выполните конфигурацию TS аналогично указанному выше

### Nuxt 3

В `Nuxt Config` в `modules` добавьте нужный пакет, после чего произведите его конфигурацию по ключу `yandexMaps`.

::: code-group

```typescript{2-5} [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vue-yandex-maps/nuxt'],
  yandexMaps: {
    apikey: 'your-api-key',
  },
});
```

:::
