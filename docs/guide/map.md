# Карта

Компонент карты `<YandexMap>`

## Входные параметры

| Имя | Описание | Тип |
|---|---|---|
| coordinates | Координаты центра карты. <br> *Обязательно*. | [ number, number ] |
| settings | [Настройки карты](https://yandex.ru/dev/maps/jsapi/doc/2.1/dg/concepts/load.html#load__param) | Object |
| zoom | Значение зума карты (от 0 до 19). <br> *По умолчанию: 18*. | number |
| bounds | Координаты левого нижнего и правого верхнего углов карты. Если атрибут задан, то значение `coords` игнорируется. | number[][] |
| [behaviors](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.behavior.Manager-docpage/#param-behaviors) | Массив подключенных поведений карты. Все остальные значения считаются выключенными. <br> *По умолчанию: [ 'default' ]*. | string[] |
| [controls](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager-docpage/#add-param-control) | Массив подключенных элементов управления картой. Все остальные значения считаются выключенными. <br> *По умолчанию: [ 'default' ]*. | string[] |
| detailed-controls | Объект, где ключами являются элементы управления картой, а значениями - объекты настроект элемента. Предназначен для тонкой настройки элементов управления. | object |
| events | [Нативные события карты](https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#Map__events-summary), которые можно слушать на компоненте. <br> *По умолчанию - [ 'click' ]* | string[] |
| map-type | Тип карты. Допустимые значения: `map, satellite, hybrid`. *Default: map*. | string |
| pan-options | [Опции перемещения](https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#method_detail__panTo-param-options) карты при смене координат центра | Object |

## События

| Имя | Описание | Тип |
| ---- | ---- | ---- |
| 'created' | Событие возникает в момент инициализации карты и содержит созданный инстанс в качестве нагрузки | Инстанс карты |
| 'geo-objects-updated' | Событие возникает в момент изменения геообъектов на карте | Геообъекты карты |
| [Нативные события карты](https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#Map__events-summary) | Все события Я.Карт | [Событие карты](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/events-docpage/)

## Классы

| Имя | Описание |
|---|---|
| yandex-container | Класс, определяющий стили контейнера, в который будет монтироваться компонент карты |
