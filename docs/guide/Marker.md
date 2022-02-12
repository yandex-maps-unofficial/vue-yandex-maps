# Маркер

Компонент маркера `<yandex-marker>`

## Входные параметры

| Имя | Описание | Тип |
|---|---|---|
| coordinates | Координаты маркера. <br> *Обязательно*. | [ number, number ] |
| type | Тип маркера. Доступные типы: `Point`, `LineString`, `Rectangle`, `Polygon`, `Circle`. <br> *По умолчанию: Point*. | string |
| radius | Радиус окружности в метрах. Используется при указании типа `Circle`. *Default: 1000*. | Number |
| properties | [Данные геообъекта](https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/GeoObject.html#GeoObject__param-feature.properties). | object |
| options | [Опции геообъекта](https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/GeoObject.html#GeoObject__param-options). | object |

