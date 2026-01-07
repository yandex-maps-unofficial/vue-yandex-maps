<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import { setupMapChildren } from '../../utils/setupMapChildren.ts';
import type { YMapScaleControl } from '@yandex/ymaps3-types';

defineOptions({ name: 'YandexMapScaleControl' });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapScaleControl | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapScaleControl>[0]>,
        default: () => ({}),
    },
    index: Number,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapScaleControl): void }>();

let mapChildren: YMapScaleControl | undefined;

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: () => new ymaps3.YMapScaleControl(props.settings),
        settings: computed(() => props.settings),
        strictMapRoot: true,
        index: toRef(props, 'index'),
    });
    emit('update:modelValue', mapChildren);
});
</script>
