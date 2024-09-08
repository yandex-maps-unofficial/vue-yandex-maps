<script lang="ts">
import { h, ref, shallowRef, triggerRef, watch } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YMapRuler } from '@yandex/ymaps3-types/modules/ruler';
import type { RenderPointCommonArgs, UpdateCommonFn } from '@yandex/ymaps3-types/modules/ruler/YMapRulerCommon';
import type { RenderPointArgs, YMapRulerProps } from '@yandex/ymaps3-types/modules/ruler/YMapRuler';
import type { YMapMarker, YMapMarkerProps } from '@yandex/ymaps3-types';
import { hF, hVue2 } from '../../../utils/system.ts';
import { getMarkerContainerProps } from '../../../utils/marker.ts';
import type { YandexMapMarkerCustomProps } from '../../../types/marker.ts';

type YMapRulerSettings = ConstructorParameters<typeof YMapRuler>[0];
export type YandexMapRulerSettings = Omit<YMapRulerSettings, 'point' | 'previewPoint'>;

export default defineComponent({
    name: 'YandexMapRuler',
    props: {
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
    },
    emits: {
        'input'(item: YMapRuler): boolean {
            return true;
        },
        'update:modelValue'(item: YMapRuler): boolean {
            return true;
        },
        'update:pointsState'(item: RenderPointArgs[]): boolean {
            return true;
        },
    },
    slots: Object as SlotsType<{
        point: RenderPointCommonArgs;
        previewPoint: {};
    }>,
    setup(props, {
        slots,
        emit,
    }) {
        let mapChildren: YMapRuler | undefined;

        class RulerPoint extends ymaps3.YMapComplexEntity<RenderPointArgs> {
            entity: Entity;

            constructor(props: RenderPointArgs, entity: Entity) {
                super(props);

                this.entity = entity;
            }

            protected _onUpdate(props: Partial<RenderPointArgs>): void {
                if (props.state !== undefined) {
                    this.entity.state!.state = props.state;
                    triggerRef(entities);
                }
            }
        }

        interface Entity {
            state: RenderPointArgs; entity: RulerPoint;
        }

        const previewPoint = ref<HTMLDivElement | null>(null);
        const entities = shallowRef<Entity[]>([]);

        watch(entities, () => {
            emit('update:pointsState', entities.value.map(x => x.state!));
        });

        const getEntity = (state: RenderPointArgs) => {
            const rulerPoint = {} as Entity;
            rulerPoint.entity = new RulerPoint(state, rulerPoint);
            return rulerPoint;
        };

        const handleEntityRequest: YMapRulerProps['point'] = params => {
            const entity = getEntity(params);
            entities.value.splice(params.state.index, 0, entity);

            entity.state = params;

            triggerRef(entities);

            return entity.entity;
        };

        const handleUpdate: UpdateCommonFn = state => {
            props.settings.onUpdate?.(state);

            if (state.points.length >= entities.value.length) return;

            entities.value = entities.value.filter(({ state: x }, index) => String(state.points[index]) === String(x?.state.coordinates));
        };

        const settings = computed<YMapRulerSettings>(() => {
            return {
                ...props.settings,
                point: handleEntityRequest,
                previewPoint: previewPoint.value ?? document.createElement('div'),
                onUpdate: handleUpdate,
            };
        });

        onMounted(async () => {
            try {
                mapChildren = await setupMapChildren({
                    createFunction: controls => new controls.YMapRuler(settings.value),
                    requiredImport: () => ymaps3.import('@yandex/ymaps3-ruler'),
                    settings,
                });

                emit('input', mapChildren);
                emit('update:modelValue', mapChildren);
            }
            catch (e) {
                console.error(e);
            }
        });

        const containerProps = computed(() => getMarkerContainerProps({
            position: props.pointProps?.position ?? 'top-center left-center',
            containerAttrs: props.pointProps?.containerAttrs,
            wrapperAttrs: props.pointProps?.wrapperAttrs,
            zeroSizes: props.pointProps?.zeroSizes,
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

        return () => {
            const list = Object.values(entities.value);

            const entitiesSlots = list.map(({ entity, state }) => {
                return hF([
                    h('div', {
                        ...containerProps.value.root,
                        ref: element => {
                            if (!element) return;

                            const settings: YMapMarkerProps = {
                                ...props.pointProps,
                                coordinates: state!.state.coordinates,
                                draggable: props.settings.editable ?? state!.state.editable,
                                source: state!.state.source,
                                onDragEnd: (...args) => {
                                    props.pointProps.onDragEnd?.(...args);
                                    state!.onDragEnd(...args);
                                },
                                onDragMove: (...args) => {
                                    props.pointProps.onDragMove?.(...args);
                                    state!.onDragMove(...args);
                                },
                                onDragStart: (...args) => {
                                    props.pointProps.onDragStart?.(...args);
                                    state!.onDragStart(...args);
                                },
                            };

                            // @ts-expect-error Protected prop
                            if (entity.children.length && (element as HTMLElement).closest('ymaps')) {
                                // @ts-expect-error Protected prop
                                const marker = entity.children[0];

                                marker.update(settings);

                                return;
                            }

                            const marker = new ymaps3.YMapMarker(settings, element as HTMLElement);

                            // @ts-expect-error Protected prop
                            entity.children.map(x => entity.removeChild(x));
                            // @ts-expect-error Protected prop
                            entity.addChild(marker);
                        },
                    }, [h('div', containerProps.value.children, slots.point(state!))]),
                ], {
                    key: String(state!.state!.index) + state?.state!.totalCount,
                });
            });

            return hVue2([
                hF(entitiesSlots),
                h('div', {
                    ...previewProps.value.root,
                    ref: previewPoint,
                }, [h('div', previewProps.value.children, slots.previewPoint({}))]),
            ]);
        };
    },
});
</script>
