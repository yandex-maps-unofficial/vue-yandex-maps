# Карта

Компонент карты

## Props

| Name | Description | Type |
|---|---|---|
| coordinates | Координаты центра карты. *Required*. | [ number, number ] |
| zoom | Значение зума карты (от 0 до 19). *Default: 18*. | number |
| bounds | Координаты левого нижнего и правого верхнего углов карты. Если атрибут задан, то значение `coords` игнорируется. | number[][] |
| [behaviors](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.behavior.Manager-docpage/#param-behaviors) | Массив подключенных поведений карты. Все остальные значения считаются выключенными.| string[] |
| [controls](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager-docpage/#add-param-control) | Массив подключенных элементов управления картой. Все остальные значения считаются выключенными.| string[] |
