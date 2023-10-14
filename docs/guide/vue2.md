---
prev:
  text: 'О проекте'
  link: '/guide/about'

next:
  text: 'Конфигурация'
  link: '/guide/configuration'
---

# Установка на Vue 2 / Nuxt Bridge / Nuxt 2

## О поддержке Vue 2

::: warning Прочитайте перед использованием
Настоятельно рекомендуем ознакомиться с информацией ниже перед использованием пакета в Vue 2.
:::

Поддержка Vue 2 планируется только для версии `2.x` этой библиотеки.

В текущем виде она реализована через несколько самопожертвований, из-за которых пришлось сделать несколько костылей.

**Например, в Vue 2 не получилось поддержать auto-complete props'ов.**

Данная версия нужна только для тех, кто по каким-то причинам ещё не может обновиться на Vue 3, но хотел бы использовать
Карты 3.0 с компонентами. Делать отдельный пакет, как это было раньше, не особо хотелось, а вообще не делать поддержку
Vue 2 было бы неразумным решением.

Из-за того, что автокомплит настроек не работает, от вас требуется соблюдать общие концепции: передавать большинство
настроек в `settings`, а то, что туда можно передавать, смотреть в документации Яндекса или внутри .d.ts компонента (
хоткей CTRL+B в Webstorm по компоненту) - то есть, если коротко, в интерфейсах TypeScript.

Так как поддержка Vue 2 оканчивается в 2023 году, а Nuxt 2 в середине 2024, после того, как поддержка будет окончена, мы
выпустим пресловутую версию 3.0 с различными Breaking Changes, среди которых будет отказ от поддержки Vue 2. Также отказ
от поддержки версии `2.x` может случиться раньше в случае, если команда Vue сделает невозможным поддержку двух версий
разом даже в текущем виде.

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

### Vue 2

В основном файле (например, main.ts) подключите Карты:

::: code-group

```typescript{2,5-7} [main.ts]
import Vue from 'vue';
import { createYmapsVue2 } from 'vue-yandex-maps';
import App from './App.vue';

Vue.use(createYmapsVue2({
  apikey: 'your-api-key',
}));

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

:::

### Nuxt Bridge

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

### Nuxt 2

В `Nuxt Config` в `modules` добавьте нужный пакет, после чего произведите его конфигурацию по ключу `yandexMaps`.

::: code-group

```typescript{2-5} [nuxt.config.js]
export default {
  modules: ['vue-yandex-maps/nuxt2'],
  yandexMaps: {
    apikey: 'your-api-key',
  },
};
```

:::
