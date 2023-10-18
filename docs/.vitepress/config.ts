import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'ru-RU',
  title: 'Vue Yandex Maps',
  description: 'Откройте для себя Яндекс карты для Vue',
  lastUpdated: true,
  locales: {
    root: {
      label: 'Русский',
      lang: 'ru',
    },
  },
  themeConfig: {
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
    sidebar: [
      {
        text: 'Начало работы',
        collapsed: false,
        items: [
          {
            text: 'О проекте',
            link: '/guide/about',
          },
          {
            text: 'Установка',
            link: '/guide/vue3',
            items: [
              {
                text: 'Vue 3 / Nuxt 3',
                link: '/guide/vue3',
              },
              {
                text: 'Vue 2 / Nuxt 2 / Nuxt Bridge',
                link: '/guide/vue2',
              },
            ],
          },
          {
            text: 'Конфигурация',
            link: '/guide/configuration',
          },
          {
            text: 'Быстрый старт',
            link: '/guide/quickstart',
          },
        ],
      },
      {
        text: 'Компоненты',
        link: '/components/',
        items: [
          {
            text: 'Общие принципы работы',
            link: '/components/',
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
                text: 'YandexMapDefaultFeaturesLayer',
                link: '/components/layer-default-features',
              },
              {
                text: 'YandexMapDefaultSchemeLayer',
                link: '/components/layer-default-scheme',
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
            ],
          },
          {
            text: 'Модули',
            collapsed: false,
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
        text: 'Примеры',
        items: [
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
                link: '/examples/map-basics',
              },
              {
                text: 'Основные параметры',
                link: '/examples/map-params',
              },
              {
                text: 'Изменить положение камеры',
                link: '/examples/camera',
              },
              {
                text: 'Кастомные тайлы на canvas',
                link: '/examples/canvas-tiles',
              },
              {
                text: 'Собственная карта',
                link: '/examples/custom-map',
              },
              {
                text: 'Изменить размер карты',
                link: '/examples/fill-container',
              },
              {
                text: 'Поместите в скрытый контейнер',
                link: '/examples/hidden-div',
              },
              {
                text: 'Ограничить область просмотра карты',
                link: '/examples/map-restrict-area',
              },
              {
                text: 'Кастомизация',
                link: '/examples/map-customization',
              },
            ],
          },
          {
            text: 'Геообъекты',
            collapsed: true,
            items: [
              {
                text: 'Добавление маркера на карту',
                link: '/examples/placemark',
              },
              {
                text: 'Маркеры со своим изображением',
                link: '/examples/marker-custom-image',
              },
              {
                text: 'Полигон',
                link: '/examples/polygon',
              },
              {
                text: 'Линия',
                link: '/examples/polyline',
              },
              {
                text: 'Перетаскиваемые объекты',
                link: '/examples/draggable-objects',
              },
              {
                text: 'Прямоугольник',
                link: '/examples/rectangle',
              },
            ],
          },
          {
            text: 'Прочее',
            collapsed: true,
            items: [
              {
                text: 'Элементы управления',
                link: '/examples/controls',
              },
              {
                text: 'Подсказки (Hints)',
                link: '/examples/hint',
              },
              {
                text: 'Всплывающие окна (Popups)',
                link: '/examples/popup',
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
      pattern: 'https://github.com/PNKBizz/vue-yandex-maps/tree/v2/docs/:path',
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
