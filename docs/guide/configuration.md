---
prev: false
---

# Конфигурация

Конфигурация пакета производится при его подключении, например, в `main.ts/app.ts` и пр. файлах для Vue в
аргументах `createYmaps`/`createYmapsVue2`, или `nuxt.config.ts` по ключу `yandexMaps` для Nuxt.

## Доступные настройки

### apikey

Передаётся в скрипт подключения Карт. Обязательный для запуска параметр.

Ключ, полученный в [Кабинете Разработчика](https://developer.tech.yandex.ru/).

::: tip Примечание
Ключ будет активирован в течение 15 минут после получения.

JS API 3.0 работает только с ключами, у которых заполнено поле "Ограничение по HTTP
Referer". [Подробнее об ограничениях](https://yandex.ru/maps-api/docs/js-api/limit.html)
:::

### lang

Локаль. Передаётся в скрипт подключения Карт. Задается в виде lang=language_region, где:

- `language` — двузначный код языка. Указывается в формате [ISO 639-1](https://ru.wikipedia.org/wiki/ISO_639-1).
- `region` — двузначный код страны. Указывается в
  формате [ISO 3166-1](https://ru.wikipedia.org/wiki/ISO_3166-1). [Подробнее про локализацию](https://yandex.ru/maps-api/docs/js-api/map/localization.html)

По умолчанию: `ru_RU`

### servicesApikeys

Объект, передаётся в `ymaps3.getDefaultConfig().setApikeys(...)` сразу после инициализации Карт. В частности, позволяет использовать `ymaps3.route` и `ymaps3.suggest`.

Принимает ключи с токенами из Кабинета разработчика.

Список ключей: [интерфейс `Apikeys`](https://yandex.ru/maps-api/docs/js-api/ref/index.html#interface-apikeys).

::: info Будьте внимательны
`ymaps3.getDefaultConfig().setApikeys` не работает после того, как был смонтирован компонент `<yandex-map>` и/или подключена карта.

Воспринимайте эту конфигурацию как самый надёжный способ задать эти ключи.
:::

### version

Передаётся в скрипт подключения Карт. По умолчанию: `v3`

### domain

Домен скрипта. По умолчанию: `https://api-maps.yandex.ru`

Из домена и скрипта формируется адрес вида `${domain}/${version}/?params`, т.е. по умолчанию
будет `https://api-maps.yandex.ru/v3/?params`

### strictMode

В строгом режиме JS API проверяет входные данные. Например, если на карту вы добавите объект, не являющийся наследником
`YMapEntity`, JS API вам об этом сообщит. С выключенным строгим режимом JS API такую проверку не сделает, и ваш код
может
работать неправильно.

По умолчанию `false`.

### initializeOn

Позволяет вам задать, когда инициализировать скрипт Яндекса. Доступные опции:

- `onPluginInit`: загрузит скрипт, как только Карты будут инициализированы (`createYmaps`/`createYmapsVue2` в Vue/Astro, или же автоматически в Nuxt)
- `onComponentMount` (значение по умолчанию): загрузит скрипт при загрузке первого компонента. Режим представляет собой
  автоматический lazy-load скрипта и является значением по умолчанию
- `never`: загрузит скрипт только когда вы вызовете `initYmaps`. Учтите: в таком варианте, если вы не вызовете
  где-либо `initYmaps` до запуска компонента, компонент упадёт с ошибкой

### importModules

Массив.

Позволяет загрузить модули Карт глобально при загрузке скрипта. Обычно модули грузятся в lazy-режиме автоматически, по
требованию.

Например, модуль `@yandex/controls-extra` загрузится только при использовании `YMapOpenMapsButton` - и так далее.

Если вы хотите грузить модули сразу, то при желании, можно указать эти модули, и они будут загружены при инициализации
Карт:

```typescript
app.use(createYmaps({
  apikey: 'your-api-key',
  importModules: ['@yandex/ymaps3-controls@0.0.1'],
}));
```

`importModules` принимает всё то же, что [принимает ymaps3.import](https://yandex.ru/maps-api/docs/js-api/reference-guide/packages.html#dostupnye-pakety).

### cdnLibraryLoading

[Подгрузка через CDN](https://yandex.ru/maps-api/docs/js-api/reference-guide/packages.html) ряда компонентов карты, объект.

- enabled (true) - выключить эту фичу. Некоторые компоненты будут при этом падать
- url (`https://cdn.jsdelivr.net/npm/{package}`) - откуда грузить пакеты
- extendLibraries - дополнительные пакеты, которые надо грузить (для ручного использования библиотек, которые не поддерживаются vue-yandex-maps)

Для загрузки модулей, которые встроены в `vue-yandex-maps`, можно использовать метод `importYmapsCDNModule` (добавляет поддержку типизации и больше ничего)

### mapsScriptWaitDuration

Время в миллисекундах, которое библиотека будет ожидать до инициализации скрипта Яндекса.

По умолчанию: `true` (5000мс). Чтобы полностью отключить это поведение, и ждать вечно, передайте `false`.

### mapsRenderWaitDuration

Время в миллисекундах, которое библиотека будет ожидать до отрисовки внутренних компонентов.

По умолчанию: `true` (5000мс). Чтобы полностью отключить это поведение, и ждать вечно, передайте `false`.

::: info Рекомендация
Не советуем отключать это поведение целиком, так как, по сути, при любой внутренней ошибке карта продолжит ждать и не выдаст exception.
:::

### scriptAttributes

Атрибуты для простановки в тэг `<script>`. По умолчанию:

- async
- defer
- referrerpolicy: strict-origin-when-cross-origin
- type: text/javascript
- id: vue-yandex-maps
- src: адрес скрипта

Если передать false, наш параметр будет удален.

## Доступ к конфигурации

Вы можете получить доступ к конфигурации следующим способом:

```typescript
import { VueYandexMaps } from 'vue-yandex-maps';

console.log(VueYandexMaps.settings.value) //ref
```

Там же в `VueYandexMaps` есть доступ к информации о загрузке скрипта (`loadStatus`, `loadError`, `isLoaded`).

При желании, `VueYandexMaps.settings` можно даже изменять, но это не проверялось - меняйте  `VueYandexMaps.settings.value` на
свой страх и риск и только если уверены в том, что по другому никак.
