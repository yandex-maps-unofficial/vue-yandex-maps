# YandexMapLayer

Компонент принимает в `settings` [YMapLayerProps](https://yandex.ru/dev/jsapi30/doc/ru/ref/#YMapLayerProps) с обязательным параметром `type` и позволяет полностью взять на себя отображение слоя и кастомизировать таким образом карту как угодно.

::: warning Важно
Собственная реализации слоев доступна только на платных тарифах.

Векторные и растровые слои не взаимозаменяемы. У них разные сигнатуры конструкторов и разный принцип работы.
:::

### Документация Яндекса
- [Собственные реализации слоёв](https://yandex.ru/dev/jsapi30/doc/ru/dg/concepts/custom-layers)
- [Слои](https://yandex.ru/dev/jsapi30/doc/ru/dg/concepts/map-objects#layers)

### Примеры
- [Основные параметры](/examples/map-params)
- [Собственная карта](/examples/custom-map)
- [Кастомные тайлы на canvas](/examples/canvas-tiles)

::: tip Совет
В [основных параметрах](/examples/map-params) нажмите "Change type and reset" - подставится слой OpenStreetMaps вместо Яндексового
:::
