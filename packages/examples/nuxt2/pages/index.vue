<template>
    <many-points/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ManyPoints from 'examples/src/components/objects/ManyPoints.vue';

export default defineComponent({
    name: 'IndexPage',
    components: {
        ManyPoints,
    },
});
</script>
