# Методы и типы инициализации Vue Yandex Maps

### yandexMapSettings

Реактивный объект с настройками Карт.

Учтите, что изменение большинства настроек после инициализации карт не приведет к какому-либо результату.

### isYandexMapReadyToInit

computed с информацией о готовности настроек к инициализации карты. Полезно кинуть карту на `v-if`, если вы инициализируете её вручную через `createYmapsOptions` позже, чем она монтируется.

### yandexMapScript

`<script>` карт в DOM дереве.

### yandexMapLoadStatus

Наш собственный тип ошибок. Полезно, если нужно проверить, что вернулось исключение именно от Vue Yandex Maps.

### yandexMapIsLoaded

boolean-computed с информацией об успешной загрузке карты

### yandexMapLoadStatus

Реактивная переменная со значениями `pending`, `loading`, `loaded`, `error`. Содержит информацию о загрузке скрипта Яндекса.

### yandexMapLoadError

Реактивная переменная. `null`, если ошибок загрузки нет, `Error` или результат `script onerror`, если что-то пошло не так.

### importLayersExtra

type-safe функция для импорта `@yandex/ymaps3-layers-extra` (также есть тип `YandexMapLayersExtra`)

## Типы

Также есть глобальные типы:

- YandexMapLoadStatus
- YandexMapPluginSettings
