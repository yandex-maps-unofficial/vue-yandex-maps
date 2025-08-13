# YandexMapDefaultMarker

Компонент подгружает модуль `@yandex/ymaps3-markers@0.0.1`, принимает
в `settings` [YMapDefaultMarkerProps](https://yandex.ru/maps-api/docs/js-api/object/markers/YMapDefaultMarker.html#props) и является
маркером с предустановленными настройками стилей.

::: info Важно
Параметр в `settings` `coordinates` является обязательным к указанию.
:::

## Слоты

Принимает слот `popup` с входным параметром `close` для закрытия всплывающего окна.

![img.png](./default-marker.png)

## Примеры использования

- [Маркер с дизайном по умолчанию](/examples/objects/default-marker)
