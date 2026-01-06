<script lang="ts">
import { h, ref, shallowRef, watch } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { hF } from '../../../utils/system.ts';
import type { YMapOverlay } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

export type YandexMapOverlayCustomProps = Omit<ConstructorParameters<typeof YMapOverlay>[0], 'htmlElement'>;

export default defineComponent({
    name: 'YandexMapOverlay',
    props: {
        value: {
            type: Object as PropType<YMapOverlay | null>,
            default: null,
        },
        modelValue: {
            type: Object as PropType<YMapOverlay | null>,
            default: null,
        },
        settings: {
            type: Object as PropType<YandexMapOverlayCustomProps>,
            required: true,
        },
    },
    emits: {
        'input'(item: YMapOverlay): boolean {
            return true;
        },
        'update:modelValue'(item: YMapOverlay): boolean {
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
        const mapChildren = shallowRef<YMapOverlay | undefined>(undefined);
        const element = ref<HTMLDivElement>(document.createElement('div'));

        watch(element, (_, oldVal) => {
            oldVal?.remove();
        });

        const getSettings = computed<ConstructorParameters<typeof YMapOverlay>[0]>(() => {
            return {
                ...props.settings,
                htmlElement: element.value,
            };
        });

        onMounted(async () => {
            mapChildren.value = await setupMapChildren({
                createFunction: theme => new theme.YMapOverlay(getSettings.value),
                requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
                settings: getSettings,
            });
            emit('input', mapChildren.value);
            emit('update:modelValue', mapChildren.value);
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
