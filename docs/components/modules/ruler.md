# YandexMapRuler
previewPointProps
Компонент подгружает модуль `@yandex/ymaps3-ruler` и позволяет измерять расстояния на карте почти как рулеткой.

Компонент принимает в `settings` [YMapRulerProps](https://yandex.ru/maps-api/docs/js-api/object/controls/measurement-elements/YMapRuler.html#ruler-api) и позволяет
измерять расстояния на карте почти как рулеткой.

::: info Внимание!
В Vue 2 компонент завезти не удалось =(
:::

## Слоты

::: warning Внимание!
Оба слота являются обязательными к передаче
:::

### point

Простой HTML-элемент, являющийся точкой, на вход принимает `RenderPointCommonArgs`, из которых вам в основном интересен `state`, содержащий
информацию об измерениях и другую информацию.

Кроме того, на вход также приходит метод `onDelete`, вызвав который вы можете удалить точку с карты.

### previewPoint

Аргументов не принимает, представляет собой элемент, который показывается при ховере на линию рулетки, и позволяет добавить новую точку на имеющейся линии.

## Дополнительные параметры

### pointProps

Настройка позволяет указать параметры для маркера точки (слот point).

Принимает то же самое, что и `settings` в [YandexMapMarker](/components/marker), кроме `coordinates`, `source` и `draggable` (`draggable` автоматически управляется через `settings.editable`).

Кроме того, настройка принимает все остальные настройки `YandexMapMarker` (`position` и пр.).

Для кластеров, `position` по умолчанию равен `left-center top-center`. Вы можете изменить это поведение, передав, например, `point-props="{ position: 'default' }"`

### previewPointProps

Принимает дополнительные настройки `YandexMapMarker`, такие как `position` и пр., либо строку `fromPointProps`, которая продублирует эти настройки из `pointProps`.

Аналогично, по умолчанию `position` равен `left-center top-center`.

## Дополнительные события

### update:pointsState

readonly-модель, возвращающая массив с состояниями всех точек. Удобно, если вам это нужно в JS.

## Примеры использования

### [Рулетка](/examples/objects/ruler)
