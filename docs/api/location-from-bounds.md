# useYMapsLocationFromBounds

Принимает на вход `bounds` и карту. Возвращает `center` и `zoom`.

```typescript
import { useYMapsLocationFromBounds } from 'vue-yandex-maps';

if(map.value) {
  const {
    center,
    zoom
  } = await useYMapsLocationFromBounds({
    bounds,
    map: map.value,
  });
}
```

> [!IMPORTANT]
> `center` незначительно отличается от того, что возвращает сам Яндекс под капотом. Возможно, они делают что-то ещё, либо это ошибка нашей библиотеки.
>
> `zoom` при этом идентичен на 100%.
