<script lang="ts">
import {
  computed, defineComponent, h, nextTick, onMounted, PropType, Ref, ref, shallowRef, VNode, watch,
} from 'vue';
import { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';
import { clusterByGrid, YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';
import { YMapEntity, YMapMarker } from '@yandex/ymaps3-types';
import { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import { setupMapChildren, throwException } from '../composables/utils';

type Settings = ConstructorParameters<typeof YMapClusterer>[0]
export type VueYandexMapClustererOptions = Omit<Settings, 'features' | 'marker' | 'cluster'>

export default defineComponent({
  name: 'YandexMapClusterer',
  props: {
    value: {
      type: Object as PropType<YMapClusterer>,
      default: null,
    },
    modelValue: {
      type: Object as PropType<YMapDefaultMarker>,
      default: null,
    },
    settings: {
      type: Object as PropType<Partial<VueYandexMapClustererOptions>>,
      default: () => ({}),
    },
    /**
     * @description Size of the grid division in pixels
     *
     * Used in settings.method via Yandex clusterByGrid method
     *
     * @see https://yandex.ru/dev/jsapi30/doc/ru/ref/packages/clusterer/
     * @see https://yandex.ru/dev/jsapi30/doc/en/ref/packages/clusterer/
     */
    gridSize: {
      type: Number,
      default: 64,
    },
  },
  emits: {
    'input'(item: YMapClusterer): boolean {
      return true;
    },
    'update:modelValue'(item: YMapClusterer): boolean {
      return true;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    let mapChildrenRenderTick = false;
    const mapChildren = shallowRef<YMapClusterer | null>(null);
    // TODO: разобраться с дубликатами в кластере
    const entities: Ref<(YMapEntity<Pick<YMapMarker, 'coordinates'>>)[]> = shallowRef([]);
    const clusterFeatures = ref<ClustererObject[]>([]);
    const clusters = ref<HTMLDivElement[]>([]);

    let _clusterByGrid: typeof clusterByGrid | undefined;

    const tickTimeout = computed(() => props.settings.tickTimeout ?? 200);

    const getSettings = computed<Settings>(() => {
      const settings = { ...props.settings } as Settings;
      if (!settings.method && _clusterByGrid) settings.method = _clusterByGrid?.({ gridSize: props.gridSize });
      settings.tickTimeout = tickTimeout.value;

      const marker: Settings['marker'] = (feature) => {
        // @ts-expect-error
        const entity = entities.value.filter((x) => x._props.coordinates[0] === feature.geometry.coordinates[0] && x._props.coordinates[1] === feature.geometry.coordinates[1]);

        if (entity.length > 1) {
          throwException({
            text: `More than one entities with coordinates of ${feature.geometry.coordinates.join(', ')} were found in YandexMapClusterer, which is not allowed`,
          });
        }
        if (!entity.length) {
          throwException({
            text: `No entity with coordinates of ${feature.geometry.coordinates.join(', ')} were found in YandexMapClusterer.`,
            isInternal: true,
          });
        }

        return entity[0];
      };

      const cluster: Settings['cluster'] = (coordinates) => {
        const foundCluster = clusters.value.find((x) => x && x.getAttribute('coordinates') === JSON.stringify(coordinates));

        /* if (!cluster) {
          throwException({
            text: `No element with coordinates of ${coordinates.join(', ')} were found in YandexMapClusterer.`,
            isInternal: true,
          });
        } */

        return new ymaps3.YMapMarker({
          coordinates,
        }, foundCluster || document.createElement('span'));
      };

      const features: Settings['features'] = entities.value.map((entity, i) => ({
        type: 'Feature',
        id: i.toString(),
        geometry: {
          type: 'Point',
          // @ts-expect-error
          coordinates: entity._props.coordinates,
        },
        // @ts-expect-error
        properties: 'properties' in entity._props ? entity._props.properties as Record<string, any> : {},
      }));

      settings.onRender = (clustersList) => {
        clusterFeatures.value = clustersList;

        if (!mapChildrenRenderTick) {
          nextTick(() => {
            mapChildrenRenderTick = true;

            // @ts-expect-error
            for (const key of Object.keys(mapChildren.value?._entitiesCache || {})) {
              // Reactivity is lost without this
              if (key.startsWith('cluster')) {
                // @ts-expect-error
                delete mapChildren.value?._entitiesCache[key];
                // @ts-expect-error
                delete mapChildren.value?._visibleEntities[key];
              }
            }

            // @ts-expect-error
            mapChildren.value?._render();
          });
        } else {
          mapChildrenRenderTick = false;
        }

        if (props.settings.onRender) return props.settings.onRender(clustersList);
      };

      return {
        ...settings,
        marker,
        features,
        cluster,
      };
    });

    watch(() => props.settings, () => {
      mapChildren.value?.update(getSettings.value);
      // @ts-expect-error
      mapChildren.value?._render();
    }, {
      deep: true,
    });

    watch(entities, () => {
      mapChildren.value?.update(getSettings.value);
      // @ts-expect-error
      mapChildren.value?._render();

      console.log(entities.value.length, mapChildren.value);
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapChildren.value = await setupMapChildren({
        createFunction: ({
          YMapClusterer: Clusterer,
          clusterByGrid: clusterByGrid_,
        }) => {
          _clusterByGrid = clusterByGrid_;

          return new Clusterer(getSettings.value);
        },
        requiredImport: () => ymaps3.import('@yandex/ymaps3-clusterer@0.0.1'),
        isMapRoot: true,
        mapRootRef: entities,
      });

      emit('input', mapChildren.value);
      emit('update:modelValue', mapChildren.value);
    });

    return () => {
      if (!mapChildren.value) return h('div');

      const clusterSlots: VNode[] = clusterFeatures.value.map((clustererObject, index) => h(
        'div',
        {
          ref: (item) => {
            clusters.value[index] = item as HTMLDivElement;
          },
          coordinates: JSON.stringify(clustererObject.lnglat),
        },
        slots.cluster?.({
          clustererObject,
          length: clustererObject.features.length,
        }),
      ));

      return h('div', [
        ...slots.default?.() || [],
        ...clusterSlots,
      ]);
    };
  },
});
</script>
