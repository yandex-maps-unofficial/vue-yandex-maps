# Подключение вручную

В некоторых случаях, вместо плагина, требуется подключение вручную. Для этого:

1. Установите пакет:
    ::: code-group
    
    ```shell [npm]
    npm install vue-yandex-maps
    ```
    
    ```shell [yarn]
    yarn add vue-yandex-maps
    ```

    ```shell [pnpm]
    pnpm install vue-yandex-maps
    ```
    :::
2. В нужном вам месте или компоненте вызовите функцию [createYmapsOptions](/api/create-options)
3. В идеале, вы должны вызвать эту функцию до рендера карты (например, в created или корне setup).

    В случае, если вы не хотите от этого зависеть, используйте computed [VueYandexMaps.isReadyToInit](/api/namespace.html#isreadytoinit).

Готово! Все компоненты будут работать, как обычно.

::: tip Совет
В случае, если у вашей карты не применились стили (например, у `__ymap_container` нет width/height), вы можете импортировать стили вручную: `import 'vue-yandex-maps/css';`.

Делайте это только в том случае, если ваш сборщик по каким-то причинам не подключил стили самостоятельно (он должен это делать сразу при импорте из `vue-yandex-maps`).
:::
