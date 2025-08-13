# YandexMapUiMarker

:::details Почему Ui, а не UI?
Потому что иначе автокомплит будет писать `<yandex-maps-u-i-marker>`, а это не весело
:::

Компонент подгружает [CDN](/guide/configuration#cdnlibraryloading)-модуль `@yandex/ymaps3-default-ui-theme`, принимает
в `settings` [YMapDefaultMarkerProps](https://yandex.ru/maps-api/docs/js-api/object/markers/YMapDefaultMarker.html#props) и
и является маркером с предустановленными стилями.

Этот маркер является альтернативной `YandexMapDefaultMarker` - итого, от Яндекса у нас есть уже три маркера.

## Слоты

Принимает слот `popup` - открывается и закрывается через settings.open

## Примеры использования

- [Маркер с дизайном по умолчанию](/examples/objects/default-marker)
