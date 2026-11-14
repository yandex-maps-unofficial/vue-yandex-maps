<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import { setupMapChildren } from '#core';
import type { YMapSearchControl } from '@yandex/ymaps3-default-ui-theme';
import { importYmapsCDNModule } from '#core';

defineOptions({ name: 'YandexMapSearchControl', render: () => null });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapSearchControl | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapSearchControl>[0]>,
        required: true,
    },
    index: Number,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapSearchControl): void }>();

let mapChildren: YMapSearchControl | undefined;

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: ({ YMapSearchControl: TiltControl }) => new TiltControl(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
        settings: computed(() => props.settings),
        strictMapRoot: true,
        index: toRef(props, 'index'),
    });
    emit('update:modelValue', mapChildren);
});
</script>
