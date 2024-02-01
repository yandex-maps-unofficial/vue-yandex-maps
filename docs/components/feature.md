# YandexMapFeature

Компонент принимает в `settings` [YMapFeatureProps](https://yandex.ru/dev/jsapi30/doc/ru/ref/#YMapFeatureProps) и позволяет рисовать геообъекты: полигоны, ломаные линии, многоугольники, и многое другое.

Обратите внимание: в нём также доступны события типа `onClick` и пр., см. [FeatureClickEvents](https://yandex.ru/dev/jsapi30/doc/ru/ref/#interface-featureclickevents)

::: info Важно
Параметр в `settings` `geometry` является обязательным к указанию.
:::

## Примеры использования
- [Ломаная](/examples/polyline)
- [Прямоугольник](/examples/rectangle)
- [Многоугольник](/examples/polygon)
