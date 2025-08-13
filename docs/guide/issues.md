# Решение проблем

#### An error occured while initializing Yandex Map with onComponentMount setting

Вариантов несколько:
1. Самый частый: вы не указали `Referer` в настройках личного кабинета Яндекса. 

   ::: tip Совет 
   Если это так - укажите (например, `localhost` для локальной разработки или `av.ru` для прода) и подождите от 20 минут до 2 часов 
   :::
2. Вы указали некорректный токен в настройках плагина
3. Произошел сбой сети у пользователя или у Яндекса

#### Мой маркер не отображается

Убедитесь, что вы указали компонент `<yandex-map-default-features-layer />`

#### *этой штуки* из API 2.0 нет в документации. Что делать?

Проверьте [документацию Яндекса](https://yandex.ru/maps-api/docs/js-api/index.html) - в частности, примеры. Если там это есть, а у нас в библиотеке нет - пишите! Если этого нет нигде, вероятно, это надо делать самостоятельно.

#### TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".css" for vue-yandex-maps/dist/vue-yandex-maps.css

Добавьте в конфиг Vite:

```typescript
ssr: {
  noExternal: [ 'vue-yandex-maps' ],
},
```
