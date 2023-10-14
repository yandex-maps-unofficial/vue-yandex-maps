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
