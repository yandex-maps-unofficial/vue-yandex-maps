# YandexMapMarker

Компонент принимает в `settings` [YMapMarkerProps](https://yandex.ru/dev/jsapi30/doc/ru/ref/#YMapMarkerProps) и позволяет добавлять произвольную верстку на карту.

Кроме того, он содержит доп. настройку `position` и принимает в себя полностью реактивное содержимое (default-слот).

В нём также доступны события типа `onClick` и пр., см. [FeatureClickEvents](https://yandex.ru/dev/jsapi30/doc/ru/ref/#interface-featureclickevents).

::: info Важно
Параметр в `settings` `coordinates` является обязательным к указанию.
:::

```vue
<template>
  <yandex-map>
    <yandex-map-default-scheme-layer :settings="{ theme: 'dark' }" />
    <yandex-map-default-features-layer />
    <yandex-map-marker
      v-for="(marker, index) in markers"
      :key="index"
      :settings="marker"
    >
      <template #default>
        <div :style="styleObject" />
      </template>
    </yandex-map-marker>
  </yandex-map>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";
import {
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker,
} from "vue-yandex-maps";
import { YMapMarkerProps } from "@yandex/ymaps3-types/imperative/YMapMarker";

const handleClick = (event: MouseEvent) => console.log(event);
const markers: YMapMarkerProps[] = [
  {
    coordinates: [51.789682128109, 55.140428698122],
    onClick: handleClick,
  },
  {
    coordinates: [54.76778893634, 57.108481458691],
    onClick: handleClick,
  },
];

const styleObject: CSSProperties = {
  position: "relative",
  width: "20px",
  height: "20px",
  backgroundColor: "#ff0000",
  borderRadius: "50%",
  border: "2px solid #ffffff",
  boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
  textAlign: "center",
  color: "#ffffff",
  fontWeight: "bold",
  lineHeight: "20px",
};
</script>
```

## Параметр `position`

Помимо `settings`, компонент принимает кастомную настройку `position`. Она пригодится, если вам кажется, что ваши маркеры "летают" по карте при зуме, и ведут себя не так, как хотелось бы.

Настройка задаёт корневому элементу маркера свойство `translate`. Принимает он практически то же самое, что и `position` в [YandexMapControls](/components/controls) - с дополнениями в виде свойства `default` и возможности передать свой `translate()`.

::: details Доступные значения и их поведение

- `default`: '0, 0' (по умолчанию)
- `top`: '0, -100%'
- `bottom`: '0, 100%'
- `left`: '-50%, 0'
- `right`: '50%, 0'
- `top left` (`left top`): '-50%, -100%'
- `top right` (`right top`): '50%, -100%'
- `bottom left` (`left bottom`): '-50%, 100%'
- `bottom right` (`right bottom`): '50%, 100%'
- `translateчтоугодно` - возможность задать своё значение свойства. Поддерживаются все CSS-`translate`:
  - `translate(0, 0)`
  - `translateX(0)`
  - `translate3d`
  - И любые свойства, начинающиеся с `translate`

Альтернативно, вы можете повесить `translate` на свой маркер самостоятельно - и это даст аналогичный эффект.
:::

::: tip Совет
Чтобы поведение обычных маркеров соответствовало Yandex Maps 2, задайте `position` на `top left`.
:::

::: details Откуда вы это взяли?
Аналогичный "костыль" использует Яндекс для центровки некоторых маркеров в `yandex.ru/maps`.

От Яндекса же было взято значение именно в `50%` для горизонтали и `100%` для вертикали (хотя вы всегда можете передать свои значения в свойство!).

Кроме того, `top left` ведёт себя так же, как вели маркеры до миграции на Карты 3.0.
:::

## Примеры использования

- [Добавление метки на карту](/examples/placemark)
- [Добавление метки с собственным изображением](/examples/marker-custom-image)
- [Попап при клике на маркер](/examples/marker-popup)
- [Скрывать маркеры вне вьюпорта](/examples/hide-markers)
