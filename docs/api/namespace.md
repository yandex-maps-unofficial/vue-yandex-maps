# namespace Vue Yandex Maps

```typescript
import { VueYandexMaps } from 'vue-yandex-maps';
```

## Содержимое

### settings

Реактивный объект с настройками Карт.

Учтите, что изменение большинства настроек после инициализации карт не приведет к какому-либо результату.

### isReadyToInit

computed с информацией о готовности настроек к инициализации карты. Полезно кинуть карту на `v-if`, если вы инициализируете её вручную через `createYmapsOptions` позже, чем она монтируется.

### script

`<script>` карт в DOM дереве.

### ymaps

`type-safe` функция, возвращает `ymaps3`. Полезно, если у вас есть проблемы с possible-undefined в TS.

### YandexMapException

Наш собственный тип ошибок. Полезно, если нужно проверить, что вернулось исключение именно от Vue Yandex Maps.

### loadStatus

Реактивная переменная со значениями `pending`, `loading`, `loaded`, `error`. Содержит информацию о загрузке скрипта Яндекса.

### loadError

Реактивная переменная. `null`, если ошибок загрузки нет, `Error` или результат `script onerror`, если что-то пошло не так.

## Типы

namespace также содержит типы:

- LoadStatus
- PluginSettings
- DefProductSettings (то же самое, что и PluginSettings, но все поля обязательные)
