# Общие принципы перехода

:::details Мем про переход
![meme.png](./migration-meme.png)

Ну если коротко, то да, так и есть
:::

## Переход с определенных версий
- [Переход с 0.xx](/guide/migration/v0)
- [Переход с 1.xx](/guide/migration/v1)

## Сервисы (ymaps.*)

Чтобы проверить, работает ли ваш сервис, после подключения Карт замените `ymaps` на `ymaps3` и проверьте в консоли, как у него дела. Ниже - о самых популярных сервисах.

Короткий вывод: в большинстве случаев вам либо требуется перейти на API Яндекса и/или реализовать функционал самостоятельно.

### ymaps.ready
Теперь промис. При желании, вы можете реактивно отслеживать `VueYandexMaps.loadStatus`:

```typescript
import { VueYandexMaps } from 'vue-yandex-maps';

watch(VueYandexMaps.loadStatus, (val) => {
  console.log(val); //pending | loading | loaded | error
  console.log(VueYandexMaps.loadError); //null | Error | script onerror (Event | string)
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
const position = await ymaps3.suggest().getPosition({});
console.log(position); //{ accuracy: 12345, coords: [12.345, 54.321] }
```

### ymaps.search

Всё еще существует, но возвращает, на первый взгляд, куда меньше данных, чем было раньше. `ymaps3.search` типизирован, но отсутствует в документации - так что можете поиграться.

Альтернативно, можно воспользоваться [API поиска по организациям](https://yandex.ru/dev/geosearch/doc/ru/).

### ymaps.route

Всё еще существует, также отсутствует в документации.

Так как создатель документации ни разу не использовал ymaps.route, совет - ознакомиться с типизацией и также, как и с `ymaps.search`, понять число изменений.

У Яндекса есть новые API, позволяющие вам реализовать этот функционал самостоятельно: https://yandex.ru/maps-api/docs#routes-navi
