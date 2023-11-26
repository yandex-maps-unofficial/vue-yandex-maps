# YandexMapDefaultSchemeLayer

Компонент принимает
в `settings` [YMapDefaultSchemeLayerProps](https://yandex.ru/dev/jsapi30/doc/ru/ref/#YMapDefaultSchemeLayerProps) и
добавляет на карту источник данных и слой схемы карт.

### `type` в настройках
- `type: 'ground'` — вся схема в растровой версии, слой земли в векторной версии
- `type: 'buildings'` — слой строений в векторной версии
- `type: 'icons'` — слой иконок в векторной версии`
- `type: 'labels'` — слой подписей в векторной версии

Этот компонент указывать нужно в большинстве кейсов использования Карт.

::: tip Примечание
А ещё, он позволяет вам сделать тёмную тему для карты!

Достаточно указать в `settings` `theme: 'dark'`.
:::
