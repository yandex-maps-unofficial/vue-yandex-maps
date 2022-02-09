import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  locales: {
    '/': {
      lang: 'ru-RU',
      title: 'Vue-yandex-maps',
      description: 'Документация на русском'
    },
    '/en/': {
      lang: 'en-US',
      title: 'Vue-yandex-maps',
      description: 'Documentation on english'
    }
  },
  themeConfig: {
    repo: 'PNKBizz/vue-yandex-map',
    locales: {
      '/': {
        selectLanguageText: 'Язык',
        selectLanguageName: 'Русский',
        title: 'Vue-yandex-maps',
        description: 'Я.Карты для Vue JS',
        navbar: [
          { text: 'v1.x-beta', children: [{ text: 'v0.x', link: 'https://vue-yandex-maps.github.io/' }] },
          { text: 'Руководство', link: '/guide/' },
          { text: 'Примеры', link: '/examples/' },
          { text: 'API Я.Карт', link: 'https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/' },
        ],
        sidebar: [ '/guide/README.md', '/guide/Map.md', '/guide/Marker.md']
      },
      '/en/': {
        selectLanguageText: 'Language',
        selectLanguageName: 'English',
        title: 'Vue-yandex-maps',
        description: 'Yandex map component for Vue JS',
        navbar: [
          { text: 'v1.x-beta', children: [{ text: 'v0.x', link: 'https://vue-yandex-maps.github.io/' }] },
          { text: 'Guide', link: '/en/guide/' },
          { text: 'Examples', link: '/en/examples/' },
          { text: 'YandexMap API ', link: 'https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/' },
        ],
        sidebar: {
          '/en/guide/': [
            '',
            'Map',
            'Marker'
          ]
        }
      }
    }
  }
})
