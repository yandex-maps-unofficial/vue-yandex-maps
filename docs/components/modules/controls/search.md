# YandexMapSearchControl

Компонент подгружает [CDN](/guide/configuration#cdnlibraryloading)-модуль `@yandex/ymaps3-default-ui-theme`, принимает
в `settings` [YMapSearchControlProps](https://yandex.ru/maps-api/docs/js-api/object/geosearch/YMapSearchControl.html#props) и
добавляет нативную поисковую строку Яндекса.

::: tip Совет
Не забудьте задать `suggest` в `servicesApikeys` в настройках при инициализации `vue-yandex-maps`, в противном случае компонент работать не будет.

Создать ключ API Геосаджеста можно в [Кабинете разработчика](https://developer.tech.yandex.ru/services).
:::

::: warning Внимание
Компонент должен использоваться строго внутри `<yandex-map-controls>`.
:::

## Примеры использования

- [Поиск и геосаджест](/examples/objects/search)
