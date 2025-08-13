# YandexMapControls

Компонент принимает в `settings` [YMapControlsProps](https://yandex.ru/maps-api/docs/js-api/object/controls/containers/YMapControls.html#parametry) и
служит контейнером для элементов управления картой.

::: info Важно
Параметр в `settings` `position` является обязательным к указанию.
:::

Внутрь себя он принимает компоненты вида `Control`: 
- [YandexMapControl](/components/control)
- [YandexMapControlButton](/components/control-button)
- [YandexMapGeolocationControl](/components/modules/controls/geolocation)
- [YandexMapZoomControl](/components/modules/controls/zoom)
- [YandexMapScaleControl](/components/control-scale)
- [YandexMapOpenMapsButton](/components/modules/controls/open-maps)

::: tip Совет
Если вам нужен на 100% кастомный контрол, вы также можете вставить в `YandexMapControls` [YandexMapEntity](entity)!

```html
<yandex-map-controls :settings="{ position: 'top left' }">
  <yandex-map-entity>
    <div>Some control</div>
  </yandex-map-entity>
</yandex-map-controls>
```

При этом учтите: у вашего элемента должен быть стиль `pointer-events: all` - иначе взаимодействовать с ним не получится.
:::

## Примеры использования

- [Элементы управления](/examples/map/controls)

Также вы можете встретить элементы управления практически в каждой секции Примеров.
