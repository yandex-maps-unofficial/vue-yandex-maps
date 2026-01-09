<template>
    <div
        ref="element"
        class="__ymap_hint"
    >
        <slot :content="hintContent"/>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, shallowRef } from 'vue';
import type { YMapHint } from '@yandex/ymaps3-hint';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { importYmapsCDNModule } from '../../../functions';

defineOptions({ name: 'YandexMapHint' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapHint | null>,
        default: null,
    },
    // Property that you will set on YandexMapMarker or YandexMapFeature to display hint content
    hintProperty: {
        type: String,
        required: true,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapHint): void }>();

defineSlots<{ default: (settings: { content: string }) => any }>();

let mapChildren: YMapHint | undefined;
const element = shallowRef<null | HTMLDivElement>(null);
const hintContent = shallowRef('');

onMounted(async () => {
    await setupMapChildren({
        createFunction: ({
            YMapHint: MapHint,
            YMapHintContext,
        }) => {
            mapChildren = new MapHint({
                hint: object => object?.properties?.[props.hintProperty],
            });

            class Hint extends ymaps3.YMapEntity<{}> {
                _onAttach() {
                    const e = this as any;

                    e._element = element.value;

                    e._detachDom = ymaps3.useDomContext(e, e._element, null);

                    e._watchContext(YMapHintContext, () => {
                        hintContent.value = e._consumeContext(YMapHintContext)?.[props.hintProperty];
                    }, { immediate: true });
                }

                _onDetach() {
                    // @ts-expect-error Restricted key
                    this._detachDom();
                }
            }

            mapChildren.addChild(new Hint({}));
            return mapChildren;
        },
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-hint'),
    });

    emit('update:modelValue', mapChildren!);
});
</script>
