# Модули и подгрузка через CDN

Ряд компонентов подгружаются как модули и CDN и не входят в "основной" скрипт.

Библиотека намеренно делает так, чтобы вам не пришлось думать о том, что происходит. При этом, ряд аспектов все равно
надо осознавать.

## Модули

Импорт модуля выглядит так: `ymaps3.import('@yandex/ymaps3-ruler')`. Модуль при этом грузится с серверов Яндекса.

## Пакеты JS API

Это `npm`-[пакеты от Яндекса](https://yandex.ru/maps-api/docs/js-api/reference-guide/packages.html). Через них грузится
достаточно большой объем функционала.

Пакеты грузятся через CDN (по умолчанию - `cdn.jsdelivr.net`). Причина в следующем: в некоторых пакетах содержится
top-level await и зависимость на ymaps3 при подключении, что делает невозможным сборку проекта, и, разумеется, ломает
SSR.

::: info Примечание
Альтернатив этому подходу не нашлось. По-хорошему, Карты должны находиться в одном большом пакете в npm без всяких подгрузок через скрипты. Почему так не сделано, остается вопросом. 
:::

Подгрузка каждого пакета идет исключительно при вызове того или иного компонента (lazy-load).

Библиотека позволяет поменять CDN через `cdnLibraryLoading.url` в конфигурации (формат аля `https://cdn.jsdelivr.net/npm/{package}`), а также добавить/изменить пакеты через `cdnLibraryLoading.extendLibraries`.

### Самостоятельное подключение пакета

```javascript
const uiTheme = await importYmapsCDNModule('@yandex/ymaps3-default-ui-theme');
console.log(uiTheme.YMapDefaultMarker);
//...
```

### Обратная совместимость

Яндекс обратную совместимость не гарантирует) По умолчанию, библиотека грузит `@latest` версии пакетов.

Открыв `npm`, вы при желании можете прописать версию каждой библиотеке через `extendLibraries`.

Пакеты, подключаемые из коробки:
- `@yandex/ymaps3-default-ui-theme@latest`
- `@yandex/ymaps3-resizer@latest`
- `@yandex/ymaps3-minimap@latest`
- `@yandex/ymaps3-context-menu@latest`
- `@yandex/ymaps3-drawer-control@latest`
- `@yandex/ymaps3-signpost@latest`
- `@yandex/ymaps3-spinner@latest`
- `@yandex/ymaps3-world-utils@latest`
- `@yandex/ymaps3-web-mercator-projection@latest`
- `@yandex/ymaps3-cartesian-projection@latest`