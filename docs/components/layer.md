# YandexMapLayer

Компонент принимает в `settings` [YMapLayerProps](https://yandex.ru/maps-api/docs/js-api/object/layers/YMapLayer.html#props) с обязательным параметром `type` и позволяет полностью взять на себя отображение слоя и кастомизировать таким образом карту как угодно.

::: info Важно
Собственная реализации слоев доступна только на платных тарифах.

Векторные и растровые слои не взаимозаменяемы. У них разные сигнатуры конструкторов и разный принцип работы.
:::

### Документация Яндекса
- [Собственные реализации слоёв](https://yandex.ru/maps-api/docs/js-api/object/layers/custom-layers.html)

## Примеры использования
- [Кастомизация карты](/examples/layers/customization)
- [Собственная карта](/examples/layers/custom-map)
- [Свой источник данных](/examples/layers/custom-map-type)
- [Кастомные тайлы на canvas](/examples/layers/canvas-tiles)
