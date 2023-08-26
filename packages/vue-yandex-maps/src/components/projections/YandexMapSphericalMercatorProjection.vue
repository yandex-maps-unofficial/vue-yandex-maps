<script lang="ts">
import { defineComponent, h, inject, onMounted, Ref } from 'vue';
import { waitTillYmapInit } from '../../composables/utils.ts';
import { Projection } from '@yandex/ymaps3-types/common/types';

export default defineComponent({
  name: 'YandexMapSphericalMercatorProjection',
  setup(props, { slots }) {
    const projection = inject<Ref<null | Projection>>('projection');

    onMounted(async () => {
      await waitTillYmapInit();
      const { SphericalMercator } = await ymaps3.import('@yandex/ymaps3-spherical-mercator-projection@0.0.1');

      if (projection) {
        projection.value = new SphericalMercator();
      }
    });

    return () => h('div', slots.default?.());
  },
});
</script>
