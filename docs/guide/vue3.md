---
next:
  text: 'Конфигурация'
  link: '/guide/configuration'
---

# Установка на Vue 3 / Nuxt 3

## Установите пакет

::: code-group

```shell [npm]
npm install vue-yandex-maps@v2
```

```shell [yarn]
yarn add vue-yandex-maps@v2
```

```shell [pnpm]
pnpm install vue-yandex-maps@v2
```

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

const app = createApp(App);x

app.use(createYmaps({
  apikey: 'your-api-key',
}));

app.mount('#app');
```

:::

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
