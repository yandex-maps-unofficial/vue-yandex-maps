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
  'basics/MapBasics': 'Создание карты',
  'basics/MapAsync': 'Асинхронная подгрузка',
  'basics/MapBehaviors': 'Изменение поведений',
  'basics/MapCamera': 'Изменение позиции камеры',
  'basics/RestrictArea': 'Ограничение области просмотра',
  'basics/MapParams': 'Перемещение карты',
  'basics/MapEvents': 'Обработка событий карты',
  'basics/HiddenDiv': 'Создание и удаление карты',
  'basics/MapControls': 'Элементы управления',

  'objects/ObjectsPlacemark': 'Общие примеры маркеров',
  'objects/ObjectsCustomImage': 'Добавление метки с собственным изображением',
  'objects/HideMarkers': 'Скрытие маркеров вне зоны видимости',
  'objects/ManyPoints': 'Кластеризатор маркеров',
  'objects/MarkerPopup': 'Маркер со всплывающим окном',
  'objects/DraggableMarker': 'Перетаскиваемый маркер',
  'objects/DefaultMarker': 'Перетаскиваемый маркер',

  'objects/ObjectsLine': 'Линия',
  'objects/ObjectsPolygon': 'Полигон',
  'objects/ObjectsRectangle': 'Прямоугольник',
  'objects/MapHint': 'Хинты',

  'layers/LayersCustomization': 'Кастомизация карты',
  'layers/CanvasTiles': 'Кастомные тайлы на canvas',
  'layers/CustomMapType': 'Свой источник данных',
  'layers/CreateCustomMap': 'Кастомная карта',
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
