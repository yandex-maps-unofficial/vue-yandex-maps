# YandexMapMarker

Компонент принимает в `settings` [YMapMarkerProps](https://yandex.ru/dev/jsapi30/doc/ru/ref/#YMapMarkerProps) и позволяет добавлять произвольную верстку на карту.

Компонент также принимает в себя полностью реактивное содержимое (default-слот).

Обратите внимание: в нём также доступны события типа `onClick` и пр., см. [FeatureClickEvents](https://yandex.ru/dev/jsapi30/doc/ru/ref/#interface-featureclickevents).

::: info Важно
Параметр в `settings` `coordinates` является обязательным к указанию.
:::

## Примеры использования

- [Добавление метки на карту](/examples/placemark)
- [Добавление метки с собственным изображением](/examples/marker-custom-image)
- [Попап при клике на маркер](/examples/marker-popup)
- [Скрывать маркеры вне вьюпорта](/examples/hide-markers)
