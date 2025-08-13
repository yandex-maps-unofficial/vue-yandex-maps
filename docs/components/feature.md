# YandexMapFeature

Компонент принимает в `settings` [YMapFeatureProps](https://yandex.ru/maps-api/docs/js-api/object/geo-objects/YMapFeature.html#props) и позволяет рисовать геообъекты: полигоны, ломаные линии, многоугольники, и многое другое.

Обратите внимание: в нём также доступны события типа `onClick` и пр., см. [FeatureClickEvents](https://yandex.ru/maps-api/docs/js-api/ref/index.html#interface-featureclickevents)

::: info Важно
Параметр в `settings` `geometry` является обязательным к указанию.
:::

## Примеры использования
- [Ломаная](/examples/objects/line)
- [Прямоугольник](/examples/objects/rectangle)
- [Многоугольник](/examples/objects/polygon)
