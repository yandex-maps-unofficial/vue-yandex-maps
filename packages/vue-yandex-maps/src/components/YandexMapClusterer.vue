<script lang="ts">
import {
  computed, defineComponent, h, nextTick, onMounted, PropType, provide, Ref, ref, watch,
  VNode,
} from 'vue';
import { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';
import { clusterByGrid, YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';
import { YMapEntity, YMapMarker } from '@yandex/ymaps3-types';
import { ClustererObject } from '@yandex/ymaps3-types/packages/clusterer/YMapClusterer/interface';
import { insertChildrenIntoMap, throwException } from '../composables/utils';

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
    let mapChildren: YMapClusterer | undefined;
    const entities: Ref<(YMapEntity<Pick<YMapMarker, 'coordinates'>>)[]> = ref([]);
    const clusterFeatures = ref<ClustererObject[]>([]);
    const clusters = ref<HTMLDivElement[]>([]);
    provide('hasClusterer', true);

    let _clusterByGrid: typeof clusterByGrid | undefined;

    const getSettings = computed<Settings>(() => {
      const settings = { ...props.settings } as Settings;
      if (!settings.method && _clusterByGrid) settings.method = _clusterByGrid?.({ gridSize: props.gridSize });

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
        // @ts-expect-error
        geometry: { type: 'Point', coordinates: entity._props.coordinates },
        // @ts-expect-error
        properties: 'properties' in entity._props ? entity._props.properties as Record<string, any> : {},
      }));

      settings.onRender = (clustersList) => {
        clusterFeatures.value = clustersList;

        if (!mapChildrenRenderTick) {
          nextTick(() => {
            mapChildrenRenderTick = true;
            // @ts-expect-error
            for (const key of Object.keys(mapChildren?._entitiesCache)) {
              // Reactivity is lost without this
              if (key.startsWith('cluster')) {
                // @ts-expect-error
                delete mapChildren?._entitiesCache[key];
                // @ts-expect-error
                delete mapChildren?._visibleEntities[key];
              }
            }

            // @ts-expect-error
            mapChildren?._render();
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

    watch(() => props, () => {
      mapChildren?.update(getSettings.value);
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapChildren = await insertChildrenIntoMap(
        ({ YMapClusterer: Clusterer, clusterByGrid: clusterByGrid_ }) => {
          _clusterByGrid = clusterByGrid_;
          return new Clusterer(getSettings.value);
        },
        () => ymaps3.import('@yandex/ymaps3-clusterer@0.0.1'),
      );

      emit('input', mapChildren);
      emit('update:modelValue', mapChildren);
    });

    function onUpdate(entity: any, key: number) {
      entities.value[key] = entity;
    }

    return () => {
      const correctSlots: VNode[] = [];

      for (const slot of slots.default?.() || []) {
        if (typeof slot.type === 'symbol' && typeof slot.children === 'object' && Array.isArray(slot.children) && slot.children?.length) {
          for (const slotChildren of slot.children) {
            let key = 0;

            if (!slotChildren || typeof slotChildren !== 'object' || !('type' in slotChildren) || typeof slotChildren.type !== 'object') continue;
            key = correctSlots.push(h(slotChildren, { 'onUpdate:modelValue': (entity: any) => onUpdate(entity, key) })) - 1;
          }
        } else if (typeof slot.type === 'object') {
          let key = 0;

          key = correctSlots.push(h(slot, { 'onUpdate:modelValue': (entity: any) => onUpdate(entity, key) })) - 1;
        }
      }

      const defaultSlots = correctSlots;

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
        ...defaultSlots,
        ...clusterSlots,
      ]);
    };
  },
});
</script>
