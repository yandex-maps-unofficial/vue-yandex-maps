# YandexMapHint

Компонент подгружает модуль `@yandex/ymaps3-hint@0.0.1` и добавляет подсказки при наведении на объекты.

Вместо `settings` принимает обязательную настройку `hintProperty` - ключ, по которому вы будете задавать содержимое хинта в `settings.properties` объектов. 

Также он принимает в себя слот `default` с параметром `content`, который и является той самой подсказкой.

## Примеры использования

### Простейший пример

```vue
<template>
  <yandex-map :settings="{ location }">
    <yandex-map-default-scheme-layer />
    <yandex-map-default-features-layer />

    <!-- Именно это отвечает за вывод хинта -->
    <yandex-map-marker
        :settings="{ coordinates, properties: { hint: `Cluster Marker` } }"
    >
      Some marker
    </yandex-map-marker>
    
    <yandex-map-hint hint-property="hint">
      <template #default="{ content }">
        <div class="hint">
          {{ content }}
        </div>
      </template>
    </yandex-map-hint>
  </yandex-map>
</template>

<style scoped>
.hint {
  position: absolute;
  padding: 4px;
  background: white;
  border: 1px solid black;
  white-space: nowrap;
  opacity: 0.7;
  transform: translate(8px, -50%);
}
</style>
```

### [Хинты](/examples/hint)
