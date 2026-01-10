# injectMap

Метод должен вызываться в корне `setup`, исключительно внутри компонентов, использующихся под `<yandex-map>`.

```typescript
const map = injectMap();
```

Возвращает `Ref<YMap | null>`