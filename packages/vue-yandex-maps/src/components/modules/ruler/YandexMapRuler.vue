<template>
    <teleport
        v-for="point in entities"
        :key="point.id"
        :to="point.host.element"
    >
        <div v-bind="containerProps.children">
            <slot
                name="point"
                v-bind="point.state"
            />
        </div>
    </teleport>
    <teleport
        v-if="previewHost"
        :to="previewHost.element"
    >
        <div v-bind="previewProps.children">
            <slot name="previewPoint"/>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, shallowReactive, shallowRef, triggerRef, watch, watchEffect } from 'vue';
import type { PropType } from 'vue';
import { createMarkerContainer, excludeYandexMarkerProps, getMarkerContainerProps, setupMapChildren } from '#core';
import type { MarkerContainer } from '#core';
import type { YMapRuler } from '@yandex/ymaps3-types/modules/ruler';
import type { RenderPointCommonArgs, UpdateCommonFn } from '@yandex/ymaps3-types/modules/ruler/YMapRulerCommon';
import type { RenderPointArgs, YMapRulerProps } from '@yandex/ymaps3-types/modules/ruler/YMapRuler';
import type { YMapComplexEntity, YMapMarker, YMapMarkerProps } from '@yandex/ymaps3-types';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';

type YMapRulerSettings = ConstructorParameters<typeof YMapRuler>[0];
export type YandexMapRulerSettings = Omit<YMapRulerSettings, 'point' | 'previewPoint'>;

defineOptions({ name: 'YandexMapRuler' });

const props = defineProps({
    value: {
        type: Object as PropType<YMapRuler | null>,
        default: null,
    },
    modelValue: {
        type: Object as PropType<YMapRuler | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<YandexMapRulerSettings>,
        default: () => ({}),
    },
    pointProps: {
        type: Object as PropType<Omit<ConstructorParameters<typeof YMapMarker>[0] & YandexMapMarkerCustomProps, 'coordinates' | 'draggable' | 'source'>>,
        default: () => ({}),
    },
    previewPointProps: {
        type: [String, Object] as PropType<YandexMapMarkerCustomProps | 'fromPointProps'>,
        default: () => ({}),
    },
    /**
     * @description readonly-array with all points states
     */
    pointsState: {
        type: Array as PropType<RenderPointArgs[]>,
        default: () => ([]),
    },
});

const emit = defineEmits<{
    (e: 'input', value: YMapRuler): void;
    (e: 'update:modelValue', value: YMapRuler): void;
    (e: 'update:pointsState', value: RenderPointArgs[]): void;
}>();

defineSlots<{
    point: (props: RenderPointCommonArgs) => any;
    previewPoint: (props: {}) => any;
}>();

interface Entity {
    id: number;
    state: RenderPointArgs;
    host: MarkerContainer;
    entity: YMapComplexEntity<RenderPointArgs>;
    marker: YMapMarker;
}

const previewHost = createMarkerContainer();
const entities = shallowRef<Entity[]>([]);
let nextPointId = 0;
let createPoint: (state: RenderPointArgs) => Entity;

function getPointSettings(state: RenderPointArgs): YMapMarkerProps {
    return {
        ...excludeYandexMarkerProps(props.pointProps),
        coordinates: state.state.coordinates,
        draggable: props.settings.editable ?? state.state.editable,
        source: state.state.source,
        onDragEnd: (...args) => {
            props.pointProps.onDragEnd?.(...args);
            state.onDragEnd(...args);
        },
        onDragMove: (...args) => {
            props.pointProps.onDragMove?.(...args);
            state.onDragMove(...args);
        },
        onDragStart: (...args) => {
            props.pointProps.onDragStart?.(...args);
            state.onDragStart(...args);
        },
    };
}

watch(entities, () => {
    emit('update:pointsState', entities.value.map(point => point.state));
});

watch(() => [props.pointProps, props.settings.editable], () => {
    for (const point of entities.value) point.marker.update(getPointSettings(point.state));
}, { deep: true });

const handleEntityRequest: YMapRulerProps['point'] = state => {
    const point = createPoint(state);
    entities.value.splice(state.state.index, 0, point);
    triggerRef(entities);
    return point.entity;
};

const handleUpdate: UpdateCommonFn = state => {
    props.settings.onUpdate?.(state);
    if (state.points.length >= entities.value.length) return;

    const actualPoints = new Set(state.points.map(point => String(point)));
    entities.value = entities.value.filter(point => actualPoints.has(String(point.state.state.coordinates)));
};

const settings = computed<YMapRulerSettings>(() => ({
    ...props.settings,
    point: handleEntityRequest,
    previewPoint: previewHost!.element,
    onUpdate: handleUpdate,
}));

onMounted(async () => {
    try {
        const ruler = await setupMapChildren({
            createFunction: controls => {
                // Define the SDK subclass only after the map and ruler module are ready.
                class RulerPoint extends ymaps3.YMapComplexEntity<RenderPointArgs> {
                    point: Entity;

                    constructor(state: RenderPointArgs) {
                        super(state);
                        const host = createMarkerContainer()!;
                        const marker = new ymaps3.YMapMarker(getPointSettings(state), host.element);
                        this.point = shallowReactive({ id: nextPointId++, state, host, marker, entity: this });
                        this.addChild(marker);
                    }

                    protected _onUpdate(update: Partial<RenderPointArgs>): void {
                        this.point.state = { ...this.point.state, ...update };
                        this.point.marker.update(getPointSettings(this.point.state));
                        triggerRef(entities);
                    }
                }

                createPoint = state => new RulerPoint(state).point;
                return new controls.YMapRuler(settings.value);
            },
            requiredImport: () => ymaps3.import('@yandex/ymaps3-ruler'),
            settings,
        });
        emit('input', ruler);
        emit('update:modelValue', ruler);
    }
    catch (e) {
        console.error(e);
    }
});

const containerProps = computed(() => getMarkerContainerProps({
    position: props.pointProps.position ?? 'top-center left-center',
    containerAttrs: props.pointProps.containerAttrs,
    wrapperAttrs: props.pointProps.wrapperAttrs,
    zeroSizes: props.pointProps.zeroSizes,
}));

const previewProps = computed(() => {
    const settings = props.previewPointProps === 'fromPointProps' ? props.pointProps : props.previewPointProps;
    return getMarkerContainerProps({
        position: settings.position ?? 'top-center left-center',
        containerAttrs: settings.containerAttrs,
        wrapperAttrs: settings.wrapperAttrs,
        zeroSizes: settings.zeroSizes,
    });
});

const pointHosts = new Set<Entity['host']>();
watchEffect(() => {
    const currentHosts = new Set(entities.value.map(point => point.host));
    for (const host of pointHosts) {
        if (!currentHosts.has(host)) {
            host.destroy();
            pointHosts.delete(host);
        }
    }
    for (const host of currentHosts) {
        host.update(containerProps.value.root);
        pointHosts.add(host);
    }
    previewHost?.update(previewProps.value.root);
}, { flush: 'post' });

onUnmounted(() => {
    for (const host of pointHosts) host.destroy();
    pointHosts.clear();
    previewHost?.destroy();
});
</script>
