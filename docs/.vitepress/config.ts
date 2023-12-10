import { defineConfig } from 'vitepress';
import packageJson from '../../packages/vue-yandex-maps/package.json' assert { type: 'json' };

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
      { icon: 'github', link: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps' },
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
        text: 'Компоненты',
        link: '/components/list'
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
            text: 'Общие принципы компонентов',
            link: '/components/',
          },
          {
            text: 'Стартовый шаблон',
            link: '/guide/quickstart',
          },
          {
            text: 'Переход с 0.xx/1.xx',
            link: '/guide/migration',
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
          { text: 'Список изменений', link: 'https://github.com/yandex-maps-unofficial/vue-yandex-maps/blob/master/CHANGELOG.md' },
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
          {
            text: 'Переход с 0.xx/1.xx',
            link: '/guide/migration',
            collapsed: true,
            items: [
              {
                text: 'Общие принципы перехода',
                link: '/guide/migration',
              },
              {
                text: 'Переход с 0.xx',
                link: '/guide/migration/v0',
              },
              {
                text: 'Переход с 1.xx',
                link: '/guide/migration/v1',
              }
            ]
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
            text: 'Карта',
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
            text: 'Маркеры',
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
                text: 'Попап при клике на маркер',
                link: '/examples/marker-popup',
              },
              {
                text: 'Скрывать маркеры вне вьюпорта',
                link: '/examples/hide-markers'
              }
            ]
          },
          {
            text: 'Линии и полигоны',
            collapsed: true,
            items: [
              {
                text: 'Ломаная',
                link: '/examples/polyline',
              },
              {
                text: 'Многоугольник',
                link: '/examples/polygon',
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
                text: 'Перетаскивание объектов',
                link: '/examples/draggable-objects',
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
      pattern: 'https://github.com/PNKBizz/vue-yandex-maps/tree/master/docs/:path',
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
