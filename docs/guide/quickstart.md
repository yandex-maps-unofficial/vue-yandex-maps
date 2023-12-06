---
next:
  text: 'Принципы работы компонентов'
  link: '/components/'
---

# Начало работы

В этом разделе подразумевается, что вы уже установили и сконфигурировали проект.

Для запуска вам потребуется:
1. Настроить карту
2. Прописать location с center/zoom в settings
3. Указать компоненты `<yandex-map-default-features-layer />` (нужен для маркеров и пр.) и `<yandex-map-default-scheme-layer />` в теле `<yandex-map />`
4. Опционально указать width/height у `<yandex-map />` (по умолчанию: 100%)

```vue
<template>
  <yandex-map
      v-model="map"
      :settings="{
        location: {
          center: [37.617644, 55.755819],
          zoom: 9,
        },
      }"
      width="100%"
      height="500px"
  >
    <yandex-map-default-scheme-layer/>
  </yandex-map>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import { YandexMap, YandexMapDefaultSchemeLayer } from 'vue-yandex-maps';

//Можно использовать для различных преобразований
const map = shallowRef<null | YMap>(null);
</script>
```

<example-quickstart :is-dark-theme="isDark()"/>

<script lang="ts" setup>
import ExampleQuickstart from 'examples/src/components/ExampleQuickstart.vue';

const isDark = () => {
    if (typeof window === 'undefined') return false;

    return document.documentElement.classList.contains('dark');
}
</script>

## Что дальше?

Прочитайте [общие принципы работы компонентов](/components/) - это важнее, чем вам может показаться. 
