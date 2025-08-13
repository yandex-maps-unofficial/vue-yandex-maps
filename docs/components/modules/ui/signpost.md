# YandexMapSignpost

Компонент подгружает [CDN](/guide/configuration#cdnlibraryloading)-модуль `@yandex/signpost`, принимает
в `settings` [YMapSignpostProps](https://yandex.ru/maps-api/docs/js-api/object/controls/signposts/YMapSignpost.html#props) и
отображает указатели, показывающие число маркеров, которые находятся вне видимой области карты.

Параметр `points` (массив координат) является обязательным к передаче.

## Примеры использования

- [Указатель на маркеры](/examples/map/signpost)
