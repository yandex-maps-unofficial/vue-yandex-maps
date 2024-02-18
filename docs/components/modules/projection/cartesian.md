# YandexMapCartesianProjection

Компонент подгружает модуль `@yandex/ymaps3-cartesian-projection@0.0.1` и является прямоугольной (декартовой)
картографической проекцией.

Принимает параметры вместо `settings`:

- `bounds`: `[LngLat, LngLat]`
- `cycled`: `[boolean, boolean]`

::: warning Внимание
Компонент необходимо добавлять только в корне `<yandex-maps>`.
:::

## Примеры использования

- [Собственная карта](/examples/layers/custom-map)
