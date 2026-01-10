<template>
    <div
        ref="element"
        class="__ymap_entity"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { onMounted, ref } from 'vue';
import type { YMapEntity } from '@yandex/ymaps3-types';
import { setupMapChildren } from '../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapEntity' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapEntity<any> | null>,
        default: null,
    },
    index: {
        type: Number,
    },
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapEntity<any> | null): void }>();

defineSlots<{ default: () => any }>();

let mapChildren: YMapEntity<any> | undefined;
const element = ref<null | HTMLDivElement>(null);

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: () => {
            class Entity extends ymaps3.YMapEntity<any> {
                _onAttach() {
                    // @ts-expect-error restricted key
                    this._element = element.value;
                    // @ts-expect-error restricted key
                    this._detachDom = ymaps3.useDomContext(this, this._element);
                }

                _onDetach() {
                    // @ts-expect-error restricted key
                    this._detachDom();
                    // @ts-expect-error restricted key
                    this._detachDom = null;
                    // @ts-expect-error restricted key
                    this._element = null;
                }
            }

            return new Entity({}) as YMapEntity<any>;
        },
        index: toRef(props, 'index'),
    }) as YMapEntity<any>;
    emit('update:modelValue', mapChildren);
});
</script>
