# YandexMapRouteControl

Компонент подгружает [CDN](/guide/configuration#cdnlibraryloading)-модуль `@yandex/ymaps3-default-ui-theme`, принимает
в `settings` [YMapRouteControlProps](https://yandex.ru/maps-api/docs/js-api/object/router/YMapRouteControl.html#props) и
добавляет нативную маршрутизацию Яндекса.

Для того, чтобы вывести результат на карту - см. как это сделано в примере ниже.

::: tip Совет
Не забудьте задать `router` в `servicesApikeys` в настройках при инициализации `vue-yandex-maps`, в противном случае метод работать не будет.

Создать ключ API Матрицы Расстояний и Построения маршрута можно в [Кабинете разработчика](https://developer.tech.yandex.ru/services).
:::

::: warning Внимание
Компонент должен использоваться строго внутри `<yandex-map-controls>`.
:::

## Примеры использования

- [Поиск и геосаджест](/examples/objects/search)
