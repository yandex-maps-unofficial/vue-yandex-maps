import { defineConfig } from 'vitepress';
import packageJson from '../../packages/vue-yandex-maps/package.json' assert { type: 'json' };

export default defineConfig({
  base: '/vue-yandex-maps/',
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
    sidebarMenuLabel: packageJson.version,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps/blob/v2' },
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
        text: 'О проекте',
        link: '/guide/about',
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
            text: 'Конфигурация',
            link: '/guide/configuration',
          },
          {
            text: 'Стартовый шаблон',
            link: '/guide/quickstart',
          },
          {
            text: 'Общие принципы работы компонентов',
            link: '/components/',
          },
          {
            text: 'YandexMap',
            link: '/components/map',
          },
        ],
      },
      {
        text: 'Песочница',
        link: '/examples/playground',
      },
      {
        text: packageJson.version,
        items: [
          { text: 'Список изменений', link: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps/blob/v2/CHANGELOG.md' },
          {
            text: 'Создать новую Issue',
            link: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps/issues/new/choose',
          },
          {
            text: 'Задать вопрос',
            link: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps/discussions'
          }
        ],
      },
    ],
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
            text: 'Начало работы',
            link: '/guide/quickstart',
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
            text: 'Основные компоненты',
            collapsed: false,
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
        collapsed: false,
        items: [
          {
            text: 'Песочница',
            link: '/examples/playground',
          },
          {
            text: 'Параметры карты',
            collapsed: true,
            items: [
              {
                text: 'Изменение позиции камеры',
                link: '/examples/camera',
              },
              {
                text: 'Изменение размера карты',
                link: '/examples/fill-container',
              },
              {
                text: 'Ограничение области просмотра карты',
                link: '/examples/map-restrict-area',
              },
              {
                text: 'Основные параметры',
                link: '/examples/map-params',
              },
              {
                text: 'Размещение в скрытом контейнере',
                link: '/examples/hidden-div',
              },
              {
                text: 'Создание карты',
                link: '/examples/map-basics',
              },
            ],
          },
          {
            text: 'Объекты на карте',
            collapsed: true,
            items: [
              {
                text: 'Добавление метки на карту',
                link: '/examples/placemark',
              },
              {
                text: 'Добавление метки с собственным изображением',
                link: '/examples/marker-custom-image',
              },
              {
                text: 'Ломаная',
                link: '/examples/polyline',
              },
              {
                text: 'Многоугольник',
                link: '/examples/polygon',
              },
              {
                text: 'Перетаскивание объектов',
                link: '/examples/draggable-objects',
              },
              {
                text: 'Попап при клике на маркер',
                link: '/examples/marker-popup',
              },
              {
                text: 'Прямоугольник',
                link: '/examples/rectangle',
              },
              {
                text: 'Скрывать маркеры вне вьюпорта',
                link: '/examples/hide-markers'
              }
            ],
          },
          {
            text: 'Прочее',
            collapsed: true,
            items: [
              {
                text: 'Кастомные тайлы на canvas',
                link: '/examples/canvas-tiles',
              },
              {
                text: 'Собственная карта',
                link: '/examples/custom-map',
              },
              {
                text: 'Элементы управления',
                link: '/examples/controls',
              },
              {
                text: 'Множество точек (Кластеризация)',
                link: '/examples/many-points',
              },
              {
                text: 'Подсказки (Хинты)',
                link: '/examples/hint',
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
