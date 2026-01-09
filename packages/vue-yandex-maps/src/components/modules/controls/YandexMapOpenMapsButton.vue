<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import type { YMapOpenMapsButton } from '@yandex/ymaps3-types/modules/controls-extra';
import { setupMapChildren } from '../../../utils/setupMapChildren.ts';

defineOptions({ name: 'YandexMapOpenMapsButton' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapOpenMapsButton | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapOpenMapsButton>[0]>,
        default: () => ({}),
    },
    index: Number,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapOpenMapsButton): void }>();

let mapChildren: YMapOpenMapsButton | undefined;

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: ({ YMapOpenMapsButton: OpenMapsButton }) => new OpenMapsButton(props.settings),
        requiredImport: () => ymaps3.import('@yandex/ymaps3-controls-extra'),
        settings: computed(() => props.settings),
        strictMapRoot: true,
        index: toRef(props, 'index'),
    });

    emit('update:modelValue', mapChildren);
});
</script>
