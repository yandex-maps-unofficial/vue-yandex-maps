# Список методов

## Инициализация карты

### [Настройки карты](/api/namespace)

Различные настройки, методы и типы для помощи в инициализации карты.

### createYmaps

Принимают на вход настройки и инициализируют `vue-yandex-maps`.

См. гайды по установке.

### [initYmaps](/api/init-ymaps)

Функция инициализации скрипта Яндекс Карт.

### [createYmapsOptions](/api/create-options)

Ручная инициализация библиотеки.

### importYmapsCDNModule

Подгрузка поддерживаемых CDN модулей с типизацией (других отличий от обычного `ymaps3.import` нет).

## Вспомогательные методы

### [getLocationFromBounds](/api/location-from-bounds)

Возвращает `center` и `zoom` согласно переданным настройкам на основе `bounds`.

### [getCenterFromCoords](/api/center-from-coords)

Принимает массив координат и возвращает их центр.

### [getBoundsFromCoords](/api/bounds-from-coords)

Принимает массив координат и возвращает их границы (`bounds`).

## Внешние методы

### [API ymaps3](yandex)
