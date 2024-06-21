<script lang="ts">
import type { YMapComplexEntity } from '@yandex/ymaps3-types';
import type { PropType, Ref, SlotsType } from 'vue';
import { computed, defineComponent, inject, onMounted } from 'vue';

import { setupMapChildren } from '../../utils/setupMapChildren.ts';
import type { ClassType } from '../../types';
import { hVue2 } from '../../utils/system.ts';

export type IYandexMapDefaultSatelliteLayerProps = {
    /** Should show layer */
    visible?: boolean;
};

export type IYandexMapDefaultSatelliteLayer = YMapComplexEntity<IYandexMapDefaultSatelliteLayerProps, {}>;

export default defineComponent({
    name: 'YandexMapDefaultSatelliteLayer',
    props: {
        value: {
            type: Object as PropType<IYandexMapDefaultSatelliteLayer | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<IYandexMapDefaultSatelliteLayer | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<{ visible?: boolean }>,
            default: () => ({}),
        },
    },
    emits: {
        'input'(item: IYandexMapDefaultSatelliteLayer): boolean {
            return true;
        },
        'update:modelValue'(item: IYandexMapDefaultSatelliteLayer): boolean {
            return true;
        },

    },
    slots: Object as SlotsType<{
        default: {};
    }>,
    setup(props, {
        slots,
        emit,
    }) {
        const hold = inject<Ref<number>>('needsToHold')!;
        hold.value++;
        let mapLayer: IYandexMapDefaultSatelliteLayer | undefined;

        onMounted(async () => {
            mapLayer = await setupMapChildren({
                createFunction: () => new (ymaps3 as unknown as {
                    YMapDefaultSatelliteLayer: ClassType<IYandexMapDefaultSatelliteLayer, [IYandexMapDefaultSatelliteLayerProps]>;
                }).YMapDefaultSatelliteLayer(props.settings || {}),
                settings: computed(() => props.settings),
                isLayer: true,
            });
            emit('input', mapLayer);
            emit('update:modelValue', mapLayer);
            hold.value--;
        });

        return () => hVue2(slots.default?.({}));
    },
});
</script>
