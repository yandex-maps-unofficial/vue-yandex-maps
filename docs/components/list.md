# Список компонентов

::: tip Примечание
Большинство компонентов придерживаются одних и тех же принципов работы.

[Узнать больше](/components/)
:::

::: details Содержимое
[[toc]]
:::

----

# Встроенные
Эти компоненты уже встроены в карту и ничего не догружают.

## Основные компоненты

### [YandexMap](map)
Основной компонент карты.

### [YandexMapCollection](collection)
Объединение элементов в коллекции.

### [YandexMapFeature](feature)
Ломаные линии, полигоны.

### [YandexMapListener](listener)
Отслеживание событий карты (`click` и пр.).

### [YandexMapMarker](marker)
Маркеры со своим содержимым.

::: tip Совет
Также смотрите маркеры со встроенным дизайном [ниже на странице](#yandexmapdefaultmarker)
:::

## Слои
### [YandexMapLayer](layer)
Возможность делать свои слои. Часть функционала доступна только на платных тарифах.

### [YandexMapDefaultSchemeLayer](layer-default-scheme)
Компонент, включающий отображение карты (и тёмную тему!).

В большинстве случаев компонент является обязательным к наличию на карте.

### [YandexMapDefaultFeaturesLayer](layer-default-features)
Компонент, включающий поддержку маркеров, ломаных линий, полигонов и прочих объектов.

В большинстве случаев компонент является обязательным к наличию на карте.

## Источники данных

### [YandexMapFeatureDataSource](feature-data-source)
Источник данных геообъектов.

### [YandexMapTileDataSource](tile-data-source)
Загрузка тайлов карт (например, с других источников, кроме Яндекса).

## Управление картой

### [YandexMapControls](controls)
Контейнер для всех элементов управления картой.

### [YandexMapControl](control)
Элемент управления со своим содержимым практически без стилей.

### [YandexMapControlButton](control-button)
Кнопка-элемент управления со своим содержимым.

::: tip Совет
Также смотрите дополнительные элементы управления [ниже на странице](#модуль-controls)
:::

## Модули
В секции вы можете найти компоненты, для загрузки которых `vue-yandex-maps` подгрузит дополнительные модули Яндекса.

Эти модули вы также можете грузить сразу при подключении Карт, см. раздел [Конфигурация](/guide/configuration).

### [YandexMapClusterer](modules/clusterer)
Кластеризация, объединение маркеров по группам. Полезно при большом числе объектов.

### [YandexMapHint](modules/hint)
Подсказки при наведении на объекты.

### [YandexMapDefaultMarker](modules/default-marker)
Маркер со стилями по умолчанию.

## Модуль Controls

### [YandexMapGeolocationControl](modules/controls/geolocation)
Кнопка геопозиции.

### [YandexMapZoomControl](modules/controls/zoom)
Кнопки управления масштабированием.

### [YandexMapOpenMapsButton](modules/controls/open-maps)
Кнопка открытия Яндекс Карт.

## Модуль Projection

### [YandexMapCartesianProjection](modules/projection/cartesian)
Декартовая проекция карты.

### [YandexMapSphericalMercatorProjection](modules/projection/mercator)
Проекция Меркатора для карты.

<style>
a {
    text-decoration: none !important;
}
</style>
