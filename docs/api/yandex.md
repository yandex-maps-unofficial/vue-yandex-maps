# API ymaps3

> [!IMPORTANT]
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
watch(VueYandexMaps.isLoaded, () => {});
const isLoaded = computed(() => VueYandexMaps.isLoaded.value);
```

## search

Осуществляет поиск по заданному запросу.

### Параметры

[SearchOptions](https://yandex.ru/dev/jsapi30/doc/ru/ref/index#SearchOptions). Среди них вы обязаны передать `text`.

### Возвращает

Promise, в случае успеха: массив [Feature](https://yandex.ru/dev/jsapi30/doc/ru/ref/index#Feature).

Данные сильно урезаны по сравнению с отдельным [API поиска по организациям](https://yandex.ru/dev/geosearch/doc/ru/).

### Пример использования

```javascript
const search = await ymaps3.search({ text: 'Москва' });

console.log(search); //Feature[]
```

## suggest

Это [геосаджест](https://yandex.ru/dev/geosuggest/doc/ru/).

Для работы требуется задать ключ в API, но Яндекс не дает это сделать с ошибкой `ymaps3: can't set up apikeys`.

## route

О предназначении этой функции можно только догадываться: при попытке вызова всегда приходит ошибка "Route requests is not allowed". Надеемся, когда-нибудь она заработает.

### Параметры

[RouteOptions](https://yandex.ru/dev/jsapi30/doc/ru/ref/index#interface-routeoptions). Среди них обязательные: `points` и `type`
