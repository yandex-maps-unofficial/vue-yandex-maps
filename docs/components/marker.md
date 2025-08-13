# YandexMapMarker

Компонент принимает в `settings` [YMapMarkerProps](https://yandex.ru/maps-api/docs/js-api/object/markers/YMapMarker.html#props) и позволяет добавлять произвольную верстку на карту.

Кроме того, он содержит доп. настройку `position` и принимает в себя полностью реактивное содержимое (default-слот).

В нём также доступны события типа `onClick` и пр., см. [FeatureClickEvents](https://yandex.ru/maps-api/docs/js-api/ref/index.html#interface-featureclickevents).

::: info Важно
Параметр в `settings` `coordinates` является обязательным к указанию.
:::

## Дополнительные параметры

Помимо `settings`, компонент принимает и другие параметры.

### position

Настройка пригодится, если вам кажется, что ваши маркеры "летают" по карте при зуме, и ведут себя не так, как хотелось бы.

Она задаёт дочернему элементу маркера (врапперу) свойства `translate`. Принимает он практически то же самое, что и `position` в [YandexMapControls](/components/controls) - с дополнениями в виде свойства `default` и возможности передать свой `translate()`.

::: details Доступные значения и их поведение

Вы можете передать любые комбинации, где:

- `top` -100%
- `top-center` -50%
- `bottom` 100%
- `bottom-center` 50%
- `left` -100%
- `left-center` -50%
- `right` 100%
- `right-center` 50%

Примеры: `top`, `left`, `top left-center`, `left top-center`, `bottom-center left`, и пр.

Также доступны:

- `default`: '0, 0' (по умолчанию)
- `translateчтоугодно` - возможность задать своё значение свойства. Поддерживаются все CSS-`translate`:
    - `translate(0, 0)`
    - `translateX(0)`
    - `translate3d`
    - И любые свойства, начинающиеся с `translate`

Альтернативно, вы можете повесить `translate` на свой маркер самостоятельно - и это даст аналогичный эффект.
:::

::: tip Совет
Чтобы поведение обычных маркеров соответствовало Yandex Maps 2, задайте `position` на `top left-center`.
:::

::: details Откуда вы это взяли?
Аналогичный "костыль" использует Яндекс для центровки некоторых маркеров в `yandex.ru/maps`.

От Яндекса же было взято рекомендованное значение именно в `50%` для горизонтали и `100%` для вертикали (хотя вы всегда можете передать свои значения в свойство!).

Кроме того, `top left-center` ведёт себя так же, как вели маркеры до миграции на Карты 3.0.
:::

### zeroSizes (boolean/null)

Настройка задаёт width и height 0 корневому элементу маркера.

Если null/не передана, то настройка будет активна, если передан `position` (и он не равен `default`). В таком случае, у вас не создастся "мёртвой" области клика на карте при перемещении маркера.

Чтобы отключить это поведение, вы можете передать `false` - `true` же сделает поведение всегда активным.

### containerAttrs (object)

Вы также можете передать свои атрибуты, такие как класс и прочее, корневому элементу.

::: warning Внимание
Если вы захотите передать свои стили, вместо того, чтобы модифицировать их через свой класс (рекомендуется), передавайте их строго объектом.

```
:container-attrs="{ class: 'my-custom-class', style: { width: '1px' } }"
```

:::

Рекомендуется, вместо модификации стилей таким образом, модифицировать свой компонент, который вы передали в маркер.

При этом, этой настройкой вы можете перезаписать наш `transform`, `width` и `height` - если это требуется.

### wrapperAttrs (object)

Аналогично `containerAttrs`, но атрибуты вешаются на дочерный элемент `__ymap-marker` (`__ymap-marker_wrapper`)

## Примеры использования

- [Маркеры](/examples/#%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%80%D1%8B)

```html
<template>
  <yandex-map height="500px">
    <yandex-map-default-scheme-layer :settings="{ theme: 'dark' }"/>
    <yandex-map-default-features-layer/>
    <yandex-map-marker
            v-for="(marker, index) in markers"
            :key="index"
            :settings="marker"
    >
      <div class="marker"/>
    </yandex-map-marker>
  </yandex-map>
</template>

<script setup lang="ts">
  import { YMapMarkerProps } from '@yandex/ymaps3-types/imperative/YMapMarker';

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
</script>

<style scoped>
  .marker {
    position: relative;
    width: 20px;
    height: 20px;
    background: #ff0000;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    text-align: center;
    color: #fff;
    font-weight: bold;
    line-height: 20px;
  }
</style>
```
