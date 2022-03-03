# Создание карты

<client-only>
  <yandex-map />
</client-only>

```vue
<template>
  <yandex-map
    :coordinates="coordinates"
    :detailed-controls="detailedControls"
    :controls="controls"
    map-type="hybrid"
  />
</template>

<script>
export default {
  setup() {
    const coordinates = [55, 33];
    const controls = ['fullscreenControl'];
    const detailedControls = {
      zoomControl: { position: { right: 10, top: 50 } }
    };

    return {
      coordinates,
      controls,
      detailedControls,
    };
  },
};
</script>
```
