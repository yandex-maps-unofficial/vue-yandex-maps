---
prev: false
next: false
---

# Общие принципы перехода с 0.х/1.х

:::details Мем про переход
![meme.png](../migration-meme.png)

Ну если коротко, то да, так и есть
:::

## Важно знать перед переходом

В разделе [О проекте](/guide/about#отличия-от-старых-версии) вы могли видеть плюсы новой версии по сравнению со старой. Однако, есть также и ряд недостатков, вызванных использованием Яндекс Карт 3.0.

Новые карты более производительные, легковесные, и код в них писать намного удобнее: не нужно прибегать к каким-то костылям и прочему.

Однако, фич в новой версии стало куда меньше (со стороны самого Яндекса). Перед обновлением, советуем ознакомиться с документацией и посмотреть, что ушло безвозвратно, что кое-как будет работать, а что можно сделать своими силами.

В частности, практически полностью исчезли компоненты со встроенным дизайном (типа окна поиска), зато их стало удобнее делать самостоятельно - и в помощь у Яндекса есть их [API Яндекс Карт](https://yandex.ru/maps-api/docs).

Желаем всем, кто переходит, удачи, и надеемся, вам понравятся новые Карты.

## Смена версии

Обновитесь до последней версии:

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

## Требования к установке

### Vue

Минимальная версия `Vue` - 3.3, а при использовании TS `vue-tsc` должен быть 1.5 и выше.

Рекомендуется использовать последние версии обеих вышеупомянутых зависимостей.

### Решение проблем с TypeScript

После установки, если у вас стоит старая версия Vue, на Vue 3 может не работать автокомплит пропсов.

Для исправления:

- Обновите версию Vue
- Обновите версию `vue-tsc` (если он у вас был)
- Обновите локфайл/зависимости (удалите node_modules, lock-файл, и сделайте install)

## Установка и конфигурация

### Vue

1. Удалите текущие Vue.use/app.use
2. Замените их на обновлённую установку

```typescript
import { createApp } from 'vue';
import YmapPlugin from 'vue-yandex-maps'; // [!code --]
import { createYmaps } from 'vue-yandex-maps'; // [!code ++]
import type { YandexMapPluginSettings } from 'vue-yandex-maps'; // [!code ++]
import App from './App.vue';

const app = createApp(App);

const settings = { // [!code --]
  apiKey: 'your-api-key', // [!code --]
  lang: 'ru_RU', // [!code --]
  coordorder: 'latlong', // [!code --]
  enterprise: false, // [!code --]
  version: '2.1' // [!code --]
} // [!code --]

//lang и version теперь задаются по умолчанию
const settings: YandexMapPluginSettings = { // [!code ++]
  apikey: 'your-api-key', // [!code ++]
}; // [!code ++]

app.use(YmapPlugin, settings); // [!code --]
app.use(createYmaps(settings)); // [!code ++]

app.mount('#app');
```

### Nuxt

Если вы используете Nuxt, то выполните следующие шаги:

1. Удалите `vue-yandex-maps` из плагинов. Вообще.
2. Подключите встроенный модуль в вашем `nuxt.config.js(ts)`:

```typescript{2-5} [Nuxt 3/Bridge, nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vue-yandex-maps/nuxt'],
  yandexMaps: {
    apikey: 'your-api-key',
  },
});
```

::: tip Совет
Для полной конфигурации см. раздел [Конфигурация](/guide/configuration).
:::

## loadYmap

Вместо данной функции, при желании, используйте `initYmaps()`.

По умолчанию, `initYmaps` вызывается автоматически при загрузке компонента `<yandex-maps>` - так что, возможно, вам вообще больше не нужна эта функция, lazy-load реализован по умолчанию.

Подробнее см. `initializeOn` в [Конфигурации](/guide/configuration.html#initializeon).

## TypeScript

Если вы используете `TypeScript` и не используете `Nuxt 3` / `Nuxt Bridge`, то для удобства работы добавьте следующую информацию в ваш `tsconfig.json`:

```json
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@yandex/ymaps3-types"
    ]
  }
}
```

В Nuxt (кроме Nuxt 2) эти строки добавляются автоматически в .nuxt/tsconfig.json.

## Сервисы (ymaps.*)

Чтобы проверить, работает ли ваш сервис, после подключения Карт замените `ymaps` на `ymaps3` и проверьте в консоли, как у него дела. Ниже - о самых популярных сервисах.

Короткий вывод: в большинстве случаев вам либо требуется перейти на API Яндекса и/или реализовать функционал самостоятельно.

### ymaps.ready

Теперь промис. При желании, вы можете реактивно отслеживать `yandexMapLoadStatus`:

```typescript
import { yandexMapLoadStatus, yandexMapLoadError } from 'vue-yandex-maps';

watch(yandexMapLoadStatus, (val) => {
  console.log(val); //pending | loading | loaded | error
  console.log(yandexMapLoadError); //null | Error | script onerror (Event | string)
});
```

### ymaps.geocode

Был выпилен. Перейдите на [API Геокодера](https://yandex.ru/dev/geocode/doc/ru/). Ключ можно использовать тот же, что и от Карт, и делать запросы прямо из браузера.

Типизации у него нет (но, надеемся, когда нибудь мы выпустим `yandex-maps-api`, где закроем и это).

### ymaps.suggest

На месте, аналогично с `ymaps.search` возвращает меньше данных, чем раньше. Рекомендуется перейти на [API Геосаджеста](https://yandex.ru/dev/geosuggest/doc/ru/).

### ymaps.geolocation

Почти всё, что там было, было выпилено. Зато появилась асинхронная функция getPosition!

```typescript
//Первый аргумент: параметры enableHighAccuracy, maximumAge, timeout
//Второй аргумент: кажется, внутренний Яндекса. Содержит setExperiments/setApikeys
const position = await ymaps3.suggest()
  .getPosition({});
console.log(position); //{ accuracy: 12345, coords: [12.345, 54.321] }
```

### ymaps.search

Всё еще существует, но возвращает, на первый взгляд, куда меньше данных, чем было раньше. `ymaps3.search` типизирован, но отсутствует в документации - так что можете поиграться.

Альтернативно, можно воспользоваться [API поиска по организациям](https://yandex.ru/dev/geosearch/doc/ru/).

### ymaps.route

Функционал сохранён, возвращает feature для отрисовки. См. [Документацию](/api/yandex.html#route)

Также Яндекса есть новые API, позволяющие вам реализовать этот функционал самостоятельно: https://yandex.ru/maps-api/docs#routes-navi

## Что дальше?

После изменения основных составляющих вы готовы мигрировать компоненты.

Гайды по миграции компонентов:

- [Переход с 0.x](/guide/migration/v0)
- [Переход с 1.x](/guide/migration/v1)
