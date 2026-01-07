# YandexMapResizer

Компонент подгружает [CDN](/components/cdn)-модуль `@yandex/ymaps3-resizer`, принимает
в `settings` [YMapResizerProps](https://yandex.ru/maps-api/docs/js-api/object/controls/zoom/YMapResizer.html#props) и
позволяет ресайзить карту в том контейнере, куда вы её положили.

::: tip Совет
Цвет по умолчанию некрасивый - меняется примерно так

```css
<style>
.ymaps3x0-resize-control {
  --ymaps3x0-resize-control-color: white;
}
</style>
```

Хотя нужен ли кому то этот компонент в принципе? Не забудьте задать максимальные размеры, кстати, а то вернуть его обратно будет трудновато.
:::

## Примеры использования

- [Элементы управления](/examples/map/controls)
