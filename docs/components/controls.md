# YandexMapControls

Компонент принимает в `settings` [YMapControlsProps](https://yandex.ru/dev/jsapi30/doc/ru/ref/#YMapControlsProps) и
служит контейнером для элементов управления картой.

Внутрь себя он принимает компоненты вида `Control`: 
- [YandexMapControl](/components/control)
- [YandexMapControlButton](/components/control-button)
- [YandexMapGeolocationControl](/components/modules/control/geolocation)
- [YandexMapZoomControl](/components/modules/control/zoom)
- [YandexMapOpenMapsButton](/components/modules/control/open-maps)

::: info Важно
Параметр в `settings` `position` является обязательным к указанию.
:::

## Примеры использования

- [Элементы управления](/examples/controls)

Также вы можете встретить элементы управления практически в каждой секции Примеров.