import { defineConfig } from 'vitepress';
import packageJson from '../../packages/vue-yandex-maps/package.json' with { type: 'json' };

export default defineConfig({
    base: '/vue-yandex-maps/',
    lang: 'ru-RU',
    title: 'Vue Yandex Maps',
    description: 'Откройте для себя Яндекс карты для Vue',
    lastUpdated: false,
    locales: {
        root: {
            label: 'Русский',
            lang: 'ru',
        },
    },
    themeConfig: {
        sidebarMenuLabel: packageJson.version,
        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps',
            },
        ],
        outline: {
            label: 'На этой странице',
            level: 'deep',
        },
        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: 'Поиск',
                    },
                    modal: {
                        displayDetails: 'Отобразить подробный список',
                        resetButtonTitle: 'Сбросить поиск',
                        backButtonTitle: 'Закрыть поиск',
                        noResultsText: 'Не найдено результатов по запросу',
                        footer: {
                            selectText: 'для выбора',
                            selectKeyAriaLabel: 'enter',
                            navigateText: 'для навигации',
                            navigateUpKeyAriaLabel: 'стрелка вверх',
                            navigateDownKeyAriaLabel: 'стрелка вниз',
                            closeText: 'чтобы закрыть',
                            closeKeyAriaLabel: 'escape',
                        },
                    },
                },
            },
        },
        i18nRouting: true,
        nav: [
            {
                text: 'Компоненты',
                link: '/components/list',
            },
            {
                text: 'API',
                link: '/api/',
            },
            {
                text: 'Руководства',
                items: [
                    {
                        text: 'Установка (Vue 3)',
                        link: '/guide/vue3',
                    },
                    {
                        text: 'Установка (Vue 2)',
                        link: '/guide/vue2',
                    },
                    {
                        text: 'Установка вручную',
                        link: '/guide/manual',
                    },
                    {
                        text: 'Конфигурация',
                        link: '/guide/configuration',
                    },
                    {
                        text: 'Общие принципы компонентов',
                        link: '/components/',
                    },
                    {
                        text: 'Переход с 0.x/1.x',
                        link: '/guide/migration',
                    },
                ],
            },
            {
                text: 'Примеры кода',
                items: [
                    {
                        text: 'Список примеров',
                        link: '/examples/',
                    },
                    {
                        text: 'Стартовый шаблон',
                        link: '/guide/quickstart',
                    },
                    {
                        text: 'Песочница',
                        link: '/examples/playground',
                    },
                ],
            },
            {
                text: packageJson.version,
                items: [
                    {
                        text: 'Список изменений',
                        link: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps/releases',
                    },
                    {
                        text: 'Создать новую Issue',
                        link: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps/issues/new/choose',
                    },
                    {
                        text: 'Задать вопрос',
                        link: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps/discussions',
                    },
                    {
                        text: 'Версия 0.x',
                        link: 'https://vue-yandex-maps.github.io/',
                    },
                    {
                        text: 'Версия 1.x',
                        link: 'https://vue-yandex-maps.github.io/new-docs/',
                    },
                    {
                        text: 'План на 3.0',
                        link: '/guide/v3',
                    },
                ],
            },
        ],
        sidebar: [
            {
                text: 'Основная информация',
                collapsed: false,
                items: [
                    {
                        text: 'О проекте',
                        link: '/guide/about',
                    },
                    {
                        text: 'Установка',
                        link: '/guide/vue3',
                        collapsed: false,
                        items: [
                            {
                                text: 'Vue 3 / Nuxt 3 / Astro',
                                link: '/guide/vue3',
                            },
                            {
                                text: 'Vue 2 / Nuxt 2 / Nuxt Bridge',
                                link: '/guide/vue2',
                            },
                            {
                                text: 'Установка вручную',
                                link: '/guide/manual',
                            },
                        ],
                    },
                    {
                        text: 'Конфигурация',
                        link: '/guide/configuration',
                    },
                    {
                        text: 'Начало работы',
                        link: '/guide/quickstart',
                    },
                    {
                        text: 'Переход с 0.x/1.x',
                        link: '/guide/migration',
                        collapsed: true,
                        items: [
                            {
                                text: 'Общие принципы перехода',
                                link: '/guide/migration',
                            },
                            {
                                text: 'Переход с 0.x',
                                link: '/guide/migration/v0',
                            },
                            {
                                text: 'Переход с 1.x',
                                link: '/guide/migration/v1',
                            },
                        ],
                    },
                    {
                        text: 'План на версию 3.0',
                        link: '/guide/v3',
                    },
                ],
            },
            {
                text: 'Компоненты',
                collapsed: false,
                items: [
                    {
                        text: 'Общие принципы работы',
                        link: '/components/',
                    },
                    {
                        text: 'Список компонентов',
                        link: '/components/list',
                    },
                    {
                        text: 'Основные компоненты',
                        collapsed: true,
                        items: [
                            {
                                text: 'YandexMap',
                                link: '/components/map',
                            },
                            {
                                text: 'YandexMapCollection',
                                link: '/components/collection',
                            },
                            {
                                text: 'YandexMapFeature',
                                link: '/components/feature',
                            },
                            {
                                text: 'YandexMapListener',
                                link: '/components/listener',
                            },
                            {
                                text: 'YandexMapMarker',
                                link: '/components/marker',
                            },
                            {
                                text: 'YandexMapEntity',
                                link: '/components/entity',
                            },
                        ],
                    },
                    {
                        text: 'Слои',
                        collapsed: true,
                        items: [
                            {
                                text: 'YandexMapLayer',
                                link: '/components/layer',
                            },
                            {
                                text: 'YandexMapDefaultSchemeLayer',
                                link: '/components/layer-default-scheme',
                            },
                            {
                                text: 'YandexMapDefaultFeaturesLayer',
                                link: '/components/layer-default-features',
                            },
                            {
                                text: 'YandexMapDefaultSatelliteLayer',
                                link: '/components/layer-default-satellite',
                            },
                        ],
                    },
                    {
                        text: 'Источники данных',
                        collapsed: true,
                        items: [
                            {
                                text: 'YandexMapFeatureDataSource',
                                link: '/components/feature-data-source',
                            },
                            {
                                text: 'YandexMapTileDataSource',
                                link: '/components/tile-data-source',
                            },
                        ],
                    },
                    {
                        text: 'Управление картой',
                        collapsed: true,
                        items: [
                            {
                                text: 'YandexMapControls',
                                link: '/components/controls',
                            },
                            {
                                text: 'YandexMapControl',
                                link: '/components/control',
                            },
                            {
                                text: 'YandexMapControlButton',
                                link: '/components/control-button',
                            },
                            {
                                text: 'YandexMapScaleControl',
                                link: '/components/control-scale',
                            },
                        ],
                    },
                    {
                        text: 'Модули',
                        collapsed: true,
                        items: [
                            {
                                text: 'YandexMapClusterer',
                                link: '/components/modules/clusterer',
                            },
                            {
                                text: 'Управление картой (controls)',
                                collapsed: true,
                                items: [
                                    {
                                        text: 'YandexMapGeolocationControl',
                                        link: '/components/modules/controls/geolocation',
                                    },
                                    {
                                        text: 'YandexMapZoomControl',
                                        link: '/components/modules/controls/zoom',
                                    },
                                    {
                                        text: 'YandexMapOpenMapsButton',
                                        link: '/components/modules/controls/open-maps',
                                    },
                                ],
                            },
                            {
                                text: 'YandexMapHint',
                                link: '/components/modules/hint',
                            },
                            {
                                text: 'YandexMapDefaultMarker',
                                link: '/components/modules/default-marker',
                            },
                            {
                                text: 'YandexMapRuler',
                                link: '/components/modules/ruler',
                            },
                            {
                                text: 'Projection',
                                collapsed: true,
                                items: [
                                    {
                                        text: 'YandexMapCartesianProjection',
                                        link: '/components/modules/projection/cartesian',
                                    },
                                    {
                                        text: 'YandexMapSphericalMercatorProjection',
                                        link: '/components/modules/projection/mercator',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                text: 'API',
                collapsed: true,
                items: [
                    {
                        text: 'Список методов',
                        link: '/api/',
                    },
                    {
                        text: 'Инициализация карты',
                        items: [
                            {
                                text: 'Инстанс VueYandexMaps',
                                link: '/api/namespace',
                            },
                            {
                                text: 'initYmaps',
                                link: '/api/init-ymaps',
                            },
                            {
                                text: 'createYmapsOptions',
                                link: '/api/create-options',
                            },
                        ],
                    },
                    {
                        text: 'Вспомогательные методы',
                        items: [
                            {
                                text: 'getLocationFromBounds',
                                link: '/api/location-from-bounds',
                            },
                            {
                                text: 'getCenterFromCoords',
                                link: '/api/center-from-coords',
                            },
                            {
                                text: 'getBoundsFromCoords',
                                link: '/api/bounds-from-coords',
                            },
                        ],
                    },
                    {
                        text: 'Внешние методы',
                        items: [
                            {
                                text: 'API ymaps3',
                                link: '/api/yandex',
                            },
                            {
                                text: 'Yandex Maps API',
                                link: '/api/yandex-maps-api',
                            },
                        ],
                    },
                ],
            },
            {
                text: 'Примеры кода',
                link: '/examples/',
                collapsed: false,
                items: [
                    {
                        text: 'Список примеров',
                        link: '/examples/',
                    },
                    {
                        text: 'Песочница',
                        link: '/examples/playground',
                    },
                    {
                        text: 'Карта',
                        collapsed: true,
                        items: [
                            {
                                text: 'Создание карты',
                                link: '/examples/map/basics',
                            },
                            {
                                text: 'Асинхронная подгрузка',
                                link: '/examples/map/async-api-load',
                            },
                            {
                                text: 'Изменение поведений',
                                link: '/examples/map/behaviors',
                            },
                            {
                                text: 'Изменение позиции камеры',
                                link: '/examples/map/camera',
                            },
                            {
                                text: 'Ограничение области просмотра',
                                link: '/examples/map/restrict-view-area',
                            },
                            {
                                text: 'Перемещение карты',
                                link: '/examples/map/moving',
                            },
                            {
                                text: 'Создание и удаление карты',
                                link: '/examples/map/create-and-delete',
                            },
                            {
                                text: 'Обработка событий карты',
                                link: '/examples/map/events',
                            },
                            {
                                text: 'Элементы управления',
                                link: '/examples/map/controls',
                            },
                        ],
                    },
                    {
                        text: 'Маркеры',
                        collapsed: true,
                        items: [
                            {
                                text: 'Общие примеры маркеров',
                                link: '/examples/objects/placemark',
                            },
                            {
                                text: 'Добавление маркера с пользовательским изображением',
                                link: '/examples/objects/marker-custom-icon',
                            },
                            {
                                text: 'Подсказка при наведении на элементы карты',
                                link: '/examples/objects/hints',
                            },
                            {
                                text: 'Скрытие маркеров вне зоны видимости',
                                link: '/examples/objects/hide-markers',
                            },
                            {
                                text: 'Кластеризатор маркеров',
                                link: '/examples/objects/clusterer',
                            },
                            {
                                text: 'Программный кластеризатор',
                                link: '/examples/objects/clusterer-program',
                            },
                            {
                                text: 'Маркер со всплывающим окном',
                                link: '/examples/objects/marker-popup',
                            },
                            {
                                text: 'Перетаскиваемый маркер',
                                link: '/examples/objects/draggable-marker',
                            },
                            {
                                text: 'Маркер с дизайном по умолчанию',
                                link: '/examples/objects/default-marker',
                            },
                        ],
                    },
                    {
                        text: 'Линии и полигоны',
                        collapsed: true,
                        items: [
                            {
                                text: 'Линия',
                                link: '/examples/objects/line',
                            },
                            {
                                text: 'Прямоугольник',
                                link: '/examples/objects/rectangle',
                            },
                            {
                                text: 'Полигон',
                                link: '/examples/objects/polygon',
                            },
                        ],
                    },
                    {
                        text: 'Слои',
                        collapsed: true,
                        items: [
                            {
                                text: 'Кастомизация карты',
                                link: '/examples/layers/customization',
                            },
                            {
                                text: 'Кастомные тайлы на canvas',
                                link: '/examples/layers/canvas-tiles',
                            },
                            {
                                text: 'Свой источник данных',
                                link: '/examples/layers/custom-map-type',
                            },
                            {
                                text: 'Кастомная карта',
                                link: '/examples/layers/custom-map',
                            },
                        ],
                    },
                    {
                        text: 'Дополнения',
                        collapsed: true,
                        items: [
                            {
                                text: 'Построение маршрута между точками',
                                link: '/examples/objects/route',
                            },
                            {
                                text: 'Поиск и Геосаджест',
                                link: '/examples/objects/search',
                            },
                            {
                                text: 'Линейка',
                                link: '/examples/objects/ruler',
                            },
                        ],
                    },
                ],
            },
        ],
        docFooter: {
            prev: 'Предыдущая страница',
            next: 'Далее',
        },
        editLink: {
            pattern: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps/tree/master/docs/:path',
            text: 'Редактировать на GitHub',
        },
        lastUpdated: {
            text: 'Обновлено',
        },
        footer: {
            message: 'Сделано с ♥ под лицензией MIT.',
        },
    },
});
