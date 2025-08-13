# YandexMapDefaultSchemeLayer

Компонент принимает
в `settings` [YMapDefaultSchemeLayerProps](https://yandex.ru/maps-api/docs/js-api/object/layers/YMapDefaultSchemeLayer.html#props) и
добавляет на карту источник данных и слой схемы карт.

### `type` в настройках
- `type: 'ground'` — вся схема в растровой версии, слой земли в векторной версии
- `type: 'buildings'` — слой строений в векторной версии
- `type: 'icons'` — слой иконок в векторной версии`
- `type: 'labels'` — слой подписей в векторной версии

Этот компонент указывать нужно в большинстве кейсов использования Карт.
