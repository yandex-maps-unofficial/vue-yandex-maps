<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, h, onMounted, ref } from 'vue';
import type { YMapPopupMarker } from '@yandex/ymaps3-default-ui-theme';
import { hF, throwException } from '../../../utils/system.ts';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export default defineComponent({
    name: 'YandexMapPopupMarker',
    inheritAttrs: false,
    props: {
        value: {
            type: Object as PropType<YMapPopupMarker | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapPopupMarker | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<Omit<ConstructorParameters<typeof YMapPopupMarker>[0], 'content'>>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapPopupMarker): boolean {
            return true;
        },
        'update:modelValue'(item: YMapPopupMarker): boolean {
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
        let mapChildren: YMapPopupMarker | undefined;
        const element = ref<null | HTMLDivElement>(null);

        const contentFunc = () => {
            return element.value!;
        };


        const getSettings = computed<ConstructorParameters<typeof YMapPopupMarker>[0]>(() => {
            return {
                ...props.settings,
                content: contentFunc,
            };
        });

        onMounted(async () => {
            if (!props.settings.coordinates) {
                throwException({
                    text: 'You must specify coordinates in YandexMapPopupMarker settings',
                });
            }

            mapChildren = await setupMapChildren({
                createFunction: ({ YMapPopupMarker: Marker }) => new Marker(getSettings.value),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
                settings: getSettings,
            });
            emit('input', mapChildren);
            emit('update:modelValue', mapChildren);
        });

        return () => {
            return hF([
                h('div', {
                    ref: element,
                }, slots.default?.({})),
            ]);
        };
    },
});
</script>
