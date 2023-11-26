# YandexMapControlButton

Компонент принимает
в `settings` [YMapControlButtonProps](https://yandex.ru/dev/jsapi30/doc/ru/ref/#YMapControlButtonProps) 
(кроме `element` - его вы, по сути, передаёте внутрь в default-слот) и позволяет вставить на карту кнопку управления с любым содержимым.

::: tip Подсказка
Не вешайте `@click` на первый элемент внутри кнопки.

Вместо этого, лучше передайте `onClick` в `settings`.
:::

## Примеры использования

- [Элементы управления](/examples/controls)

Также вы можете встретить кнопки во многих секциях Примеров.
