# Методы инициализации компонента

Данные методы позволяют самостоятельно удобно создавать свои компоненты Яндекс Карт.

## setupMapChildren

Метод позволяет добавить дочерний элемент на карту. Выполнять требуется внутри `onMounted`, исключительно внутри компонентов, использующихся под `<yandex-map>`..

```typescript
onMounted(async () => {
    const control = await setupMapChildren({
        createFunction: controls => new controls.YMapGeolocationControl(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
        settings: computed(() => props.settings),
        strictMapRoot: true,
        index: toRef(props, 'index'),
    });
});
```

### Настройки

- `willDeleteByHand`: не будет автоматически удалять компонент в `onBeforeUnmount`: удалить потребуется вручную через `deleteMapChildren`
- `returnOnly`: вернет компонент, но не добавит его на карту
- `strictMapRoot`: компонент крашнется, если он был вставлен не под `mapRoot`. Полезно, когда вы делаете компоненты, внутри которых еще компоненты - например, `YandexMapControls`
- `mapRoot`: результат выполнения функции `provideMapRoot`
- `requiredImport`: результат выполнения какой-либо асинхронной функции, например `importYmapsCDNModule` или `ymaps3.import`
- `createFunction`: метод, создающий инстанс Яндекса. **Обязательный параметр**. Должен возвращать `YMapEntity`
- `settings`: реактивные настройки для автоматического вызова `.update(settings)` на инстанс Яндекса
- `settingsUpdateIgnoreKeys`: исключает указанные ключи из авто-обновления
- `settingsUpdateFull`: всегда обновляет настройки целиком - по умолчанию идет сравнение того, что изменилось, и передается только это
- `isLayer`: компонент является слоем и должен быть вставлен строго при инициализации карты
- `isProjection`: компонент является проекцией и должен быть вставлен особым методом строго при инициализации карты
- `index`: порядковый номер элемента в дочерней коллекции карты, такой как mapRoot

### Возвращает

Промис с созданным в `createFunction` инстансом

## provideMapRoot

Метод позволяет создать компонент, внутри которого будут еще компоненты.

Результат необходимо передать в `setupMapChildren`. 

Компонент необходимо вызывать в корне `setup`, исключительно внутри компонентов, использующихся под `<yandex-map>`. Он использует `provide` для дочерних элементов.

```typescript
///entities использовать не обязательно, можно вообще ничего не передавать
const entities = shallowRef<(YMapEntity<Pick<YMapMarker, 'coordinates'>>)[]>([]);
const mapRoot = provideMapRoot({ mapRootRef: entities });

mapChildren.value = await setupMapChildren({
    createFunction: ({
                         YMapClusterer: Clusterer,
                         clusterByGrid: _clusterByGrid_,
                     }) => {
        // ...
    },
    requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-clusterer'),
    mapRoot,
});
```

```typescript
const mapRoot = provideMapRoot();

onMounted(async () => {
    mapChildren.value = await setupMapChildren({
        createFunction: controls => new controls.YMapContextMenu(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-context-menu'),
        settings: computed(() => props.settings),
        mapRoot,
    });
    emit('update:modelValue', mapChildren.value);
});
```

### Настройки

- `mapRootRef`: позволяет использовать свой массив вместо Яндексового элемента (в данном случае вместо addChild будут использоваться методы массива по типу push)

### Возвращает

- `mapRootRef`: реф с инстансом Яндекса или массив переданный в настройках
- `mapRootInitPromises`: реф с промисами, которое будут использованы при инициализации компонента в `setupMapChildren`

Оба параметра надо передать в `setupMapChildren` как объект `mapRoot`.

## deleteMapChildren

Удаляет элемент с карты. Используется под капотом в `setupMapChildren`.

```typescript
 deleteMapChildren({
    children: children.value,
    // Необязательно
    isMercator: isProjection,
    root: mapRoot?.value ? mapRoot : map,
});
```

### Настройки

- `children`: `YMapEntity` или `Projection`
- `isMercator`: `true`, если передана проекция. Необязательный параметр
- `root`: инстанс карты, `YMapGroupEntity` или массив

