<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import type { YMapZoomControl } from '@yandex/ymaps3-default-ui-theme';

import { setupMapChildren } from '../../../utils/setupMapChildren.ts';
import { importYmapsCDNModule } from '../../../functions';

defineOptions({ name: 'YandexMapZoomControl' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapZoomControl | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapZoomControl>[0]>,
        default: () => ({}),
    },
    index: Number,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapZoomControl): void }>();

let mapChildren: YMapZoomControl | undefined;

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: controls => new controls.YMapZoomControl(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
        settings: computed(() => props.settings),
        strictMapRoot: true,
        index: toRef(props, 'index'),
    });
    emit('update:modelValue', mapChildren);
});
</script>
