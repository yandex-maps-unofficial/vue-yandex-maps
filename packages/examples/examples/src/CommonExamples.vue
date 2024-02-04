<template>
  <div class="examples">
    <label>
      Выберите демо-страницу

      <input v-model="page" list="pages" name="yandex-map-pages" />

      <datalist id="pages">
        <option v-for="(name, component) in pages" :key="component" :value="component">
          {{ name }}
        </option>
      </datalist>
    </label>

    <component :is="asyncComponent" class="examples_component" />
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent, h, onMounted, ref, shallowRef, watch,
} from 'vue';

const pages = {
  'basics/MapCamera': 'Изменение позиции камеры',
  'basics/FillContainer': 'Изменение размера карты',
  'basics/RestrictArea': 'Ограничение области карты',
  'basics/MapParams': 'Основные параметры',
  'basics/HiddenDiv': 'Размещение в скрытом контейнере',
  'basics/MapBasics': 'Создание карты',
  'basics/CanvasTiles': 'Кастомные тайлы на canvas',
  'basics/CustomMap': 'Собственная карта',

  'objects/ObjectsPlacemark': 'Добавление метки',
  'objects/ObjectsCustomImage': 'Добавление метки с собственным изображением',
  'objects/MarkerPopup': 'Попап при клике на маркер',
  'objects/HideMarkers': 'Скрывать маркеры вне вьюпорта',
  'objects/ObjectsLine': 'Ломаная',
  'objects/ObjectsPolygon': 'Многоугольник (полигон)',
  'objects/ObjectsRectangle': 'Прямоугольник',
  'objects/DraggableObjects': 'Перетаскивание объектов',

  'misc/MapControls': 'Элементы управления',
  'misc/ManyPoints': 'Множество точек (Кластеризация)',
  'misc/MapHint': 'Подсказки (Хинты)',
} satisfies Record<string, string>;
const page = ref<keyof typeof pages | null>(null);

const createComponent = () => {
  if (page.value && pages[page.value]) {
    const splitted = page.value.split('/');

    return import(`./components/${splitted[0]}/${splitted[1]}.vue`);
  }
  return Promise.resolve(h('div'));
};

const asyncComponent = shallowRef(defineAsyncComponent(createComponent));

onMounted(() => {
  const hash = location.hash.substring(1) as keyof typeof pages;

  if (pages[hash]) {
    page.value = hash;
  }

  watch(page, (val) => {
    if (pages[val as keyof typeof pages]) {
      location.hash = `#${val}`;

      asyncComponent.value = defineAsyncComponent(createComponent);
    }
  }, {
    immediate: true,
  });
});
</script>
