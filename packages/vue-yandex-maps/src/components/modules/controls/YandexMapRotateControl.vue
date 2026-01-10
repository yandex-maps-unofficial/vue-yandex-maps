<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import type { YMapRotateControl } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '../../../functions/init.ts';

defineOptions({ name: 'YandexMapRotateControl' });

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
