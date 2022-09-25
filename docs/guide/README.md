# Введение

Компонент позволяет без усилий подключить Я.Карты в проект.
## Установка

Подключите компонент, используя ваш пакетный менеджер

<CodeGroup>
  <CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add vue-yandex-maps@beta
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm install vue-yandex-maps@beta
```

  </CodeGroupItem>
</CodeGroup>

После этого вы можете определить [настройки подключения компонента](https://yandex.ru/dev/maps/jsapi/doc/2.1/dg/concepts/load.html#load__param). Эти настройки являются опциональными, значения по умолчанию указаны ниже.

```js
const settings = {
  apiKey: '', // Индивидуальный ключ API
  lang: 'ru_RU', // Используемый язык
  coordorder: 'latlong', // Порядок задания географических координат
  debug: false, // Режим отладки
  version: '2.1' // Версия Я.Карт
}
```

Теперь вы можете использовать эти настройки при регистрации вашего компонента.

## Регистрация компонента

### Глобальная

```js
import YmapPlugin from 'vue-yandex-maps'

Vue.use(YmapPlugin, settings)
```

### Локальная

```js
import { YandexMap, YandexMarker } from 'vue-yandex-maps'

export default {
  components: { yandexMap, yandexMarker }
  // other options
}

```
```html
<YandexMap :settings="settings" :coordinates="[32, 50]">
    <!--Markers-->
</YandexMap>
```

### Ymaps Loader

Если вам нужно использовать глобальную переменную `ymaps` отдельно от компонента карт (геокодер и др.), просто импортируйте лоадер с настройками, описанными выше. Учтите, что функция загрузчика асинхронная.

```js
import { loadYmap } from 'vue-yandex-maps'

export default {
  async mounted() {
    await loadYmap(settings);
    // здесь доступна переменная ymaps
  }
}
```

### Nuxt

При использовании с `Nuxt` нужно учитывать, что компонент является полностью клиентским. Пример плагина для глобального подключения Я.Карт.

```js
// plugins/yandex-map.client.js

import plugin from 'vue-yandex-maps'
import { defineNuxtPlugin } from 'nuxt/app'

const settings = {
  // здесь ваши настройки
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(plugin, settings)
})
```
При использовании компонента необходимо оборачивать его в тег `<client-only>` или каким-то еще образом избегать отрисовки на стороне сервера.
