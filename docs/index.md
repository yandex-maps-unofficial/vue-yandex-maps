---
layout: home
editLink: false
footer: true

hero:
  name: Vue Yandex Maps
  text: Обертка для<br>Яндекс Карт
  tagline: Библиотека с интеграцией компонентов ymaps3
  actions:
    - theme: brand
      text: Начало работы
      link: /guide/about
    - theme: alt
      text: Переход с других версий
      link: /guide/migration
    - theme: alt
      text: Открыть на Github
      link: https://github.com/yandex-maps-unofficial/vue-yandex-maps

features:
  - icon: 🚀
    title: Легковесная
    details: "Библиотека поддерживает Vapor Mode через отдельный импорт, а из зависимостей только библиотеки от Яндекса, которые используются для типизации.<br><br>Библиотека использует ES Modules, поддерживает Tree Shaking, написана на TypeScript - и собирается без полифиллов!"
  - icon: ⚙️
    title: Гибкая
    details: Все компоненты передают оригинальный инстанс Яндекса в v-model.<br><br>А обновлять версии библиотек Яндекса и использовать новые возможности можно не дожидаясь новых версий!
  - icon: ⭐
    title: Удобная
    details: Без дополнительных настроек реализована поддержка SSR и Lazy Loading.<br><br>Загрузка дополнительных модулей для компонентов реализована автоматически, без участия разработчика.
---