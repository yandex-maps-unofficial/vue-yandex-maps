import { defineUserConfig, defaultTheme } from 'vuepress'
import { path } from '@vuepress/utils'
const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')

export default defineUserConfig({
  base: '/new-docs/',
  plugins: [
    registerComponentsPlugin({
        components: {
          YandexMap: path.resolve(__dirname, '../components/YandexMap.vue'),
          YandexMarkers: path.resolve(__dirname, '../components/YandexMarkers.vue'),
        },
      })
  ],
  locales: {
    '/': {
      lang: 'ru-RU',
      title: 'Vue-yandex-maps',
      description: 'Документация на русском для vue-yandex-maps'
    },
    '/en/': {
      lang: 'en-US',
      title: 'Vue-yandex-maps',
      description: 'Documentation on english for vue-yandex-maps'
    }
  },
  theme: defaultTheme({
    repo: 'PNKBizz/vue-yandex-map',
    locales: {
      '/': {
        selectLanguageText: 'Язык',
        selectLanguageName: 'Русский',
        navbar: [
          { text: 'v1.x-beta', children: [{ text: 'v0.x', link: 'https://vue-yandex-maps.github.io/' }] },
          { text: 'Руководство', link: '/guide/' },
          { text: 'Примеры', link: '/examples/map-create' },
          { text: 'API Я.Карт', link: 'https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/' },
        ],
        sidebar: {
          '/guide/': [ '/guide/README.md', '/guide/map.md', '/guide/marker.md', '/guide/collection.md', '/guide/clusterer.md'],
          '/examples/': ['/examples/map-create.md', '/examples/markers.md']
        }
      },
      '/en/': {
        selectLanguageText: 'Language',
        selectLanguageName: 'English',
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
  })
})
