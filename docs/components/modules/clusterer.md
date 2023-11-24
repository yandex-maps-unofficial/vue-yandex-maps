# YandexMapClusterer

Компонент подгружает модуль `@yandex/ymaps3-clusterer@0.0.1`, принимает в `settings` `YandexMapClustererOptions` и
позволяет оптимизировать отрисовку большого числа
маркеров (кластеризация).

В случае с этим компонентом хочется поподробнее остановиться на доступных настройках.

## Настройки

### gridSize

По умолчанию: `64`. Будет передан в `settings.method` в случае, если вы не заменили `method` чем-то своим.

Значение влияет на то, как будут группироваться маркеры на карте, а точнее - на охват группировки. Чем выше - тем больше
маркеров будут объединяться в
группы.

::: info
В параметр советуется передавать значения, кратные степеням двойки: `32`, `64`, `128` и пр.

С другими значениями он не испытывался.
:::

### clusterMarkerProps

Настройка позволяет указать параметры для маркера, в котором рисуется кластер.

Принимает то же самое, что и `settings` в [YandexMapMarker](/components/marker), кроме `coordinates`.

### settings

#### method

Передавать его требуется только в том случае, если вам требуется изменить метод отрисовки своей рендер-функцией. Если вы
не передадите этот параметр, отрисовка будет работать автоматически на основе пропса `gridSize` и метода `clusterByGrid`
от Яндекса.

#### tickTimeout

Из документации Яндекса: время, которое пройдёт перед тем, как случится ререндер.

Или, если перефразировать: время между ре-рендерами.

По умолчанию: `200`.

#### onRender

Метод, который будет вызываться перед каждой новой отрисовкой. Принимает аргумент с массивом `ClustererObject`.

Если вы вернёте в нём `false`, отрисовка выполнена не будет.

#### features, marker, cluster

Если вы посмотрите в документацию Яндекса, там также будут вышеуказанные параметры. В нашей обертке, передавать их не
требуется - они передадутся в Яндекса автоматически.

## Слоты

### default

Слот с набором компонентов для отрисовки. Тестировался только с [YandexMapMarker](/components/marker).

### cluster

Слот с кластером. Под капотом представляет собой `YandexMapMarker`.

В слот передаются:

- `clusterer`: [ClustererObject](https://yandex.ru/dev/jsapi30/doc/ru/ref/packages/clusterer/#ClustererObject)
- `coordinates`: `clusterer.coordinates`
- `length`: `clusterer.features.length` (число элементов в кластере)

::: tip Совет
Вы можете кастомизировать настройки маркера кластера параметром `clusterMarkerProps`.
:::

## Примеры использования

### Простейший пример

```vue

<template>
  <yandex-map :settings="{ location }" v-model="map">
    <yandex-map-default-features-layer/>
    <yandex-map-default-scheme-layer/>

    <yandex-map-clusterer
        :clusterMarkerProps="{ onClick: () => localLocation = { center: coordinates, zoom: 9, duration: 1000 } }"
    >
      <yandex-map-marker
          v-for="(coordinates, index) in markers"
          :key="index"
          :settings="{ coordinates }"
      >
        <div class="hint">
          Cluster Marker #{{ index }}
        </div>
      </yandex-map-marker>

      <template #cluster="{ coordinates, length }">
        <div class="cluster" @click="map!.setLocation({ coordinates, zoom: 9 })">
          {{ length }}
        </div>
      </template>
    </yandex-map-clusterer>
  </yandex-map>
</template>

<script setup lang="ts">
  import type { YMap } from '@yandex/ymaps3-types';

  const map = shallowRef<YMap | null>(null);
</script>
```

### [Множество точек](/examples/many-points)
