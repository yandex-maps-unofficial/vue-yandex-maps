<script lang="ts" setup>
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { computed, onMounted } from 'vue';
import type { YMapGeolocationControl } from '@yandex/ymaps3-default-ui-theme';
import { setupMapChildren } from '#core';
import { importYmapsCDNModule } from '#core';

defineOptions({ name: 'YandexMapGeolocationControl', render: () => null });

const props = defineProps({
    modelValue: {
        type: Object as PropType<YMapGeolocationControl | null>,
        default: null,
    },
    settings: {
        type: Object as PropType<ConstructorParameters<typeof YMapGeolocationControl>[0]>,
        default: () => ({}),
    },
    index: Number,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: YMapGeolocationControl): void }>();

let mapChildren: YMapGeolocationControl | undefined;

onMounted(async () => {
    mapChildren = await setupMapChildren({
        createFunction: controls => new controls.YMapGeolocationControl(props.settings),
        requiredImport: () => importYmapsCDNModule('@yandex/ymaps3-default-ui-theme'),
        settings: computed(() => props.settings),
        strictMapRoot: true,
        index: toRef(props, 'index'),
    });

    emit('update:modelValue', mapChildren);
});
</script>
