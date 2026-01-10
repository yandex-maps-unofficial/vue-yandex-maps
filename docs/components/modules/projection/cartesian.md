# YandexMapCartesianProjection

Компонент подгружает [CDN](/components/cdn)-модуль `@yandex/ymaps3-cartesian-projection` и является прямоугольной (декартовой)
картографической проекцией.

Принимает параметры вместо `settings`:

- `bounds`: `[LngLat, LngLat]`
- `cycled`: `[boolean, boolean]`

::: warning Внимание
Компонент необходимо добавлять только в корне `<yandex-maps>`.
:::

## Примеры использования

- [Собственная карта](/examples/layers/custom-map)
