<script lang="ts">
import type { PropType, Ref, VNode } from 'vue';
import {
  computed, defineComponent, h, nextTick, onMounted, ref, shallowRef, watch,
} from 'vue';
import type { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';
import type { clusterByGrid, Feature, YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';
import type { YMapCollection, YMapEntity, YMapMarker } from '@yandex/ymaps3-types';
import type { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import { setupMapChildren, throwException } from '../../../composables/utils.ts';

type Settings = ConstructorParameters<typeof YMapClusterer>[0]
export type YandexMapClustererOptions = Omit<Settings, 'features' | 'marker' | 'cluster'>

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
      type: Object as PropType<Partial<YandexMapClustererOptions>>,
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
    const mapChildren = shallowRef<(Pick<YMapClusterer, 'update'> & Record<string, any>) | null>(null);
    const entities: Ref<(YMapEntity<Pick<YMapMarker, 'coordinates'>>)[]> = shallowRef([]);
    const clusterFeatures = ref<{ clusterer: ClustererObject, element: YMapCollection }[]>([]);

    let _clusterByGrid: typeof clusterByGrid | undefined;

    const tickTimeout = computed(() => props.settings.tickTimeout ?? 200);

    const getSettings = computed<Settings>(() => {
      const settings = { ...props.settings } as Settings;
      if (!settings.method && _clusterByGrid) settings.method = _clusterByGrid?.({ gridSize: props.gridSize });
      settings.tickTimeout = tickTimeout.value;

      const marker: Settings['marker'] = (feature: Pick<Feature, 'geometry'>) => {
        const entity = entities.value.filter((x: Record<string, any>) => x._props.coordinates[0] === feature.geometry.coordinates[0] && x._props.coordinates[1] === feature.geometry.coordinates[1]);

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
        const foundCluster = clusterFeatures.value.find((x) => JSON.stringify(x.clusterer.lnglat) === JSON.stringify(coordinates));

        if (!foundCluster) {
          throwException({
            text: `No element with coordinates of ${coordinates.join(', ')} were found in YandexMapClusterer.`,
            isInternal: true,
          });
        }

        return foundCluster.element as YMapMarker;
      };

      const features: Settings['features'] = entities.value.map((entity: Record<string, any>, i) => ({
        type: 'Feature',
        id: Math.random()
          .toString() + Date.now()
          .toString(),
        geometry: {
          type: 'Point',
          coordinates: entity._props.coordinates,
        },
        properties: 'properties' in entity._props ? entity._props.properties : {},
      }));

      settings.onRender = (clustersList) => {
        clusterFeatures.value = clustersList.map((clusterer) => ({
          clusterer,
          element: clusterFeatures.value.find((x) => x.clusterer.clusterId === clusterer.clusterId)?.element || new ymaps3.YMapCollection({}),
        }));

        if (props.settings.onRender) return props.settings.onRender(clustersList);
      };

      return {
        ...settings,
        marker,
        features,
        cluster,
      };
    });

    const update = async () => {
      await nextTick();
      mapChildren.value?.update(getSettings.value);
      mapChildren.value?._render();

      setTimeout(() => mapChildren.value?._render(), tickTimeout.value);
    };

    watch(() => [props.settings, props.gridSize], () => {
      update();
    }, {
      deep: true,
    });

    const init = async () => {
      mapChildren.value = await setupMapChildren({
        createFunction: ({
          YMapClusterer: Clusterer,
          clusterByGrid: _clusterByGrid_,
        }) => {
          _clusterByGrid = _clusterByGrid_;
          return new Clusterer(getSettings.value);
        },
        requiredImport: () => ymaps3.import('@yandex/ymaps3-clusterer@0.0.1'),
        isMapRoot: true,
        mapRootRef: entities,
      });

      emit('input', mapChildren.value as YMapClusterer);
      emit('update:modelValue', mapChildren.value as YMapClusterer);
    };

    watch(entities, async () => {
      await nextTick();
      update();
    });

    onMounted(() => {
      init();
    });

    return () => {
      if (!mapChildren.value) return h('div');

      const features = clusterFeatures.value.filter((x) => x.clusterer.features.length > 1);

      const clusterSlots: VNode[] = features
        .map(({
          clusterer,
          element,
        }, index) => h(
          'div',
          {
            key: `${clusterer.clusterId}_${index}_${clusterer.features.length}_${clusterer.lnglat.join(',')}`,
            ref: async (item) => {
              if (!item) return;

              await nextTick();

              try {
                element.children.forEach((x) => element.removeChild(x as any));

                element.addChild(new ymaps3.YMapMarker({
                  coordinates: clusterer.lnglat,
                }, item as HTMLDivElement));
              } catch (e) {
                console.error(e);
              }
            },
            attrs: {
              coordinates: JSON.stringify(clusterer.lnglat),
            },
            // @ts-ignore
            coordinates: JSON.stringify(clusterer.lnglat),
          },
          slots.cluster?.({
            clusterer,
            coordinates: clusterer.lnglat,
            length: clusterer.features.length,
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
