# API ymaps3

> [!IMPORTANT] Примечание
> Учтите: данный раздел является альтернативой практически отсутствующей у Яндекса документацией и может не содержать на 100% актуальных данных.
>
> Актуальные данные от самого Яндекса находятся `@yandex/ymaps3-types`. Данный раздел будет поддерживаться настолько актуальным, насколько возможно.

## geolocation.getPosition

### Параметры

Всё то же, что и [navigator.geolocation.getCurrentPosition](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition#options)

### Возвращает

Promise, в случае успеха, содержащим объект с полями:

- `coords`: координаты в Яндексовом порядке (lon, потом lat). Возвращается всегда
- `accuracy`: точность местоположения. Возвращается только в том случае, если пользователь разрешил определять геолокацию

### Пример использования

```javascript
const position = await ymaps3.geolocation.getPosition();
```

## ready

Promise. Выполняется после успешной инициализации скрипта Карт.

### Пример использования

```javascript
await ymaps3.ready;

//Карты готовы
```

Альтернативно, можно использовать:

```javascript
import { VueYandexMaps } from 'vue-yandex-maps';

//VueYandexMaps.isLoaded - реактивный ref
watch(VueYandexMaps.isLoaded, () => {
});
const isLoaded = computed(() => VueYandexMaps.isLoaded.value);
```

## search

Осуществляет поиск по заданному запросу.

### Параметры

[SearchOptions](https://yandex.ru/maps-api/docs/js-api/ref/index.html#SearchOptions). Среди них вы обязаны передать `text`.

### Возвращает

Promise, в случае успеха: массив [Feature](https://yandex.ru/maps-api/docs/js-api/ref/index.html#Feature).

Данные сильно урезаны по сравнению с отдельным [API поиска по организациям](https://yandex.ru/dev/geosearch/doc/ru/).

### Пример использования

- [Поиск и Геосаджест](/examples/objects/search.html)

## suggest

Это [аналог геосаджеста](https://yandex.ru/dev/geosuggest/doc/ru/).

Для работы этой функции необходимо указать `suggest` в `servicesApikeys` в настройках инициализации `vue-yandex-maps`. Ключ можно создать в вашем [Кабинете разработчика](https://developer.tech.yandex.ru/services).

### Параметры

[SuggestOptions](https://yandex.ru/maps-api/docs/js-api/ref/index.html#SuggestOptions). Среди них вы обязаны передать `text` и, по хорошему, `types`.

### Возвращает

Promise, в случае успеха: массив [SuggestResponseItem](https://yandex.ru/maps-api/docs/js-api/ref/index.html#SuggestResponseItem).

### Пример использования

- [Поиск и Геосаджест](/examples/objects/search.html)

## route

Это [аналог построения маршрута](https://yandex.ru/dev/geosuggest/doc/ru/).

Для работы этой функции необходимо указать `router` в `servicesApikeys` в настройках инициализации `vue-yandex-maps`. Ключ можно создать в вашем [Кабинете разработчика](https://developer.tech.yandex.ru/services).

### Параметры

[RouteOptions](https://yandex.ru/maps-api/docs/js-api/ref/index.html#interface-routeoptions). Среди них обязательные: `points` и `type`

### Возвращает

Массив [BaseRouteResponse](https://yandex.ru/maps-api/docs/js-api/ref/index.html#interface-baserouteresponse), содержащий единственную функцию `toRoute`, которая в свою очередь возвращает [RouteFeature](https://yandex.ru/maps-api/docs/js-api/ref/index.html#interface-routefeature).

По сути, с помощью этого вы можете использовать `<yandex-map-feature>` для построения линии маршрута.

### Пример использования

- [Построение маршрута между двумя точками](/examples/objects/route.html)
