<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { setupMapChildren } from '#core';
import type { YMapRotateControl } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '#core';

defineOptions({ name: 'YandexMapRotateControl', render: () => null });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapRotateControl | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapRotateControl>[0]>,
        default: () => ({}),
    },
    index: Number,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapRotateControl): void }>();

let mapChildren: YMapRotateControl | undefined;

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: ({ YMapRotateControl: RotateControl }) => new RotateControl(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
        settings: computed(() => props.settings),
        strictMapRoot: true,
        index: toRef(props, 'index'),
    });
    emit('update:modelValue', mapChildren);
});
</script>
