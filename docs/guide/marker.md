# Маркер

Компонент маркера `<YandexMarker>`. Слот принимает компонент, который будет монтироваться при открытии балуна. Это позволяет использовать все возможности Vue в балуне Я.Карт. Важно явно задать ширину и высоту

## Входные параметры

| Имя | Описание | Тип |
|---|---|---|
| coordinates | Координаты маркера. <br> *Обязательно*. | [ number, number ] |
| marker-id | Уникальный идентификатор маркера. <br> *Обязательно*. | number \| string |
| type | Тип маркера. Доступные типы: `Point`, `LineString`, `Rectangle`, `Polygon`, `Circle`. <br> *По умолчанию: Point*. | string |
| radius | Радиус окружности в метрах. Используется при указании типа `Circle`. *Default: 1000*. | number |
| properties | [Данные геообъекта](https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/GeoObject.html#GeoObject__param-feature.properties). | object |
| options | [Опции геообъекта](https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/GeoObject.html#GeoObject__param-options). | object |
| events | [Нативные события маркера](https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/GeoObject.html#GeoObject__events-summary), которые можно слушать на компоненте. <br> *По умолчанию - [ 'click' ]* | string[] |

## События

[Нативные события маркера](https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/GeoObject.html#GeoObject__events-summary)

## Классы

| Имя | Описание |
|---|---|
| yandex-balloon | Класс, определяющий стили контейнера, в который будет монтироваться компонент балуна |
