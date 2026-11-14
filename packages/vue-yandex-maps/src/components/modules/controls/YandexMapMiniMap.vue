<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { setupMapChildren } from '#core';
import type { YMapMiniMap } from '@yandex/ymaps3-minimap';
import { importYmapsCDNModule } from '#core';

defineOptions({ name: 'YandexMapMiniMap', render: () => null });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapMiniMap | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapMiniMap>[0]>,
        default: () => ({}),
    },
    index: Number,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapMiniMap): void }>();

let mapChildren: YMapMiniMap | undefined;

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: controls => new controls.YMapMiniMap(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-minimap'),
        settings: computed(() => props.settings),
        strictMapRoot: true,
        index: toRef(props, 'index'),
    });
    emit('update:modelValue', mapChildren);
});
</script>
