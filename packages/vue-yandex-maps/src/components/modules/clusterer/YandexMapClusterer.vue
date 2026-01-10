<template>
    <div
        v-if="!mapChildren"
        class="__ymap_clusterer--empty"
    />
    <div
        v-else
        class="__ymap-clusterer"
    >
        <slot/>
        <yandex-map-clusterer-clusters
            :cluster-marker-props
            :zoom-on-cluster-click
            @trueBounds="emit('trueBounds', $event)"
            @updatedBounds="emit('updatedBounds', $event)"
            @updatedCluster="revision++"
        >
            <template #default="options">
                <slot
                    name="cluster"
                    v-bind="options"
                />
            </template>
        </yandex-map-clusterer-clusters>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { PropType } from 'vue';
import { computed, nextTick, onMounted, provide, shallowRef, watch } from 'vue';
import type { clusterByGrid, Feature, YMapClusterer, ClustererObject } from '@yandex/ymaps3-clusterer';
import type { LngLatBounds, YMapCollection, YMapEntity, YMapMarker } from '@yandex/ymaps3-types';
import { throwException } from '../../../utils/system.ts';
import { provideMapRoot, setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';
import type { EasingFunctionDescription } from '@yandex/ymaps3-types/common/types';
import YandexMapClustererClusters from './YandexMapClustererClusters.vue';
import { importYmapsCDNModule } from '../../../functions';

type Settings = ConstructorParameters<typeof YMapClusterer>[0];
export type YandexMapClustererOptions = Partial<Omit<Settings, 'cluster'>>;

export type YandexMapClustererZoomOptionsObject = {
    duration?: number;
    easing?: EasingFunctionDescription;

    /**
   * @description zoomCorrect will apply Math.floor after initial bounds update. boundsCorrect will instead subtract the distance between left top and right bottom coordinates of bounds.
   *
   * If boundsCorrect is active, updated bounds will be returned in updatedBounds event.
   * @default zoomCorrect
   */
    strategy?: 'zoomCorrect' | 'boundsCorrect';

    /**
   * @description By default, if objects are too close to borders, library will add -1 zoom for user's comfort.
   *
   * This can work poor on large grid sizes and/or high density of objects. You can disable behavior by using this setting.
   */
    disableMinimalZoomCorrectDiff?: boolean;
};

export interface IYMapClusterFeature {
    clusterer: ClustererObject;
    element: YMapCollection;
}

defineOptions({ name: 'YandexMapClusterer' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapClusterer | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<YandexMapClustererOptions>,
        default: () => ({}),
    },
    /**
   * @description All custom (non-settings) props are also supported
   */
    clusterMarkerProps: {
        type: Object as PropType<Omit<ConstructorParameters<typeof YMapMarker>[0], 'coordinates'> & YandexMapMarkerCustomProps>,
        default: () => ({}),
    },
    /**
   * @description Size of the grid division in pixels
   *
   * Used in settings.method via Yandex clusterByGrid method
   *
   * @see https://yandex.ru/maps-api/docs/js-api/object/markers/YMapClusterer.html
   */
    gridSize: {
        type: Number,
        default: 64,
    },
    /**
   * @description Zooms to bounds of features of cluster
   */
    zoomOnClusterClick: {
        type: [Boolean, Object] as PropType<boolean | YandexMapClustererZoomOptionsObject>,
        default: false,
    },
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: YMapClusterer): void;
    (e: 'trueBounds', value: LngLatBounds): void;
    (e: 'updatedBounds', value: LngLatBounds): void;
}>();

defineSlots<{
    default: () => any;
    cluster: (options: {
        clusterer: ClustererObject;
        coordinates: ClustererObject['lnglat'];
        length: number;
    }) => any;
}>();

const mapChildren = shallowRef<(Pick<YMapClusterer, 'update'> & Record<string, any>) | null>(null);
const entities = shallowRef<(YMapEntity<Pick<YMapMarker, 'coordinates'>>)[]>([]);
const clusterFeatures = shallowRef<IYMapClusterFeature[]>([]);
const revision = ref(0);

const filteredFeatures = computed(() => clusterFeatures.value.filter(x => x.clusterer.features.length > 1));
provide('clusterFeatures', filteredFeatures);

let _clusterByGrid: typeof clusterByGrid | undefined;

const tickTimeout = computed(() => props.settings.tickTimeout);

const getSettings = () => {
    const settings = { ...props.settings } as Settings;
    if (!settings.method && _clusterByGrid) settings.method = _clusterByGrid?.({ gridSize: props.gridSize });
    if (tickTimeout.value) settings.tickTimeout = tickTimeout.value;

    let marker: Settings['marker'] | undefined = settings.marker;

    if (!marker) {
        marker = (feature: Feature) => {
            const entity = entities.value.find((x: Record<string, any>) => x._props.id === feature.id);

            if (!entity) {
                throwException({
                    text: `No entity with id ${ feature.id } (coordinates: ${ feature.geometry.coordinates.join(', ') }) were found in YandexMapClusterer.`,
                    isInternal: true,
                    warn: true,
                });
                return new ymaps3.YMapMarker({ coordinates: feature.geometry.coordinates });
            }

            return entity;
        };
    }

    const cluster: Settings['cluster'] = coordinates => {
        const foundCluster = clusterFeatures.value.find(x => x.clusterer.lnglat[0] === coordinates[0] && x.clusterer.lnglat[1] === coordinates[1]);

        if (!foundCluster) {
            throwException({
                text: `No element with coordinates of ${ coordinates.join(', ') } were found in YandexMapClusterer.`,
                isInternal: true,
                warn: true,
            });
            return new ymaps3.YMapMarker({ coordinates });
        }

        return foundCluster.element as YMapMarker;
    };

    let features: Settings['features'] | undefined = settings.features;

    if (!features) {
        features = entities.value.map((entity: Record<string, any>, i) => {
            if (!entity._props.id) {
                entity.update({
                    id: Math
                        .random()
                        .toString() +
                        Date.now().toString(),
                });
            }

            return {
                type: 'Feature',
                id: entity._props.id,
                geometry: {
                    type: 'Point',
                    coordinates: entity._props.coordinates,
                },
                properties: 'properties' in entity._props ? entity._props.properties : {},
            };
        });
    }

    settings.onRender = clustersList => {
        if (clustersList.length <= 1) revision.value++;

        clusterFeatures.value = clustersList.map(clusterer => {
            clusterer.clusterId = `cluster-${ revision.value }-${ clusterer.features.map(x => x.id).join(',') }`;

            return {
                clusterer,
                element: clusterFeatures.value.find(x => x.clusterer.clusterId === clusterer.clusterId)?.element || new ymaps3.YMapCollection({}),
            };
        });

        if (props.settings.onRender) return props.settings.onRender(clustersList);
    };

    return {
        ...settings,
        marker,
        features,
        cluster,
    };
};

const update = async () => {
    clusterFeatures.value = [];
    await nextTick();
    mapChildren.value?.update(getSettings());
    mapChildren.value?._render();
};

watch(() => [props.settings, props.gridSize], () => {
    update();
}, {
    deep: true,
});

const mapRoot = provideMapRoot({ mapRootRef: entities });

const init = async () => {
    mapChildren.value = await setupMapChildren({
        createFunction: ({
            YMapClusterer: Clusterer,
            clusterByGrid: _clusterByGrid_,
        }) => {
            _clusterByGrid = _clusterByGrid_;

            const settings = getSettings();

            if (settings.features.length > 0) {
                // When rendering with `YandexMapMarker` components, initially features are empty.
                // When passing features from settings, initially features are not empty. This causes clusters not to be rendered until the map is zoomed in
                settings.features = [];
            }

            return new Clusterer(settings);
        },
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-clusterer'),
        mapRoot,
    });

    emit('update:modelValue', mapChildren.value as YMapClusterer);
};

watch(entities, async () => {
    await nextTick();
    update();
});

onMounted(async () => {
    await init();
});
</script>
