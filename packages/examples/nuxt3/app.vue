<template>
    <example-component/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ExampleComponent from 'examples/src/CommonExamples.vue';

export default defineComponent({
    name: 'App',
    components: {
        ExampleComponent,
    },
    setup() {
        const route = useRoute();
        const event = useRequestEvent();
        if (event && route.path !== '/') setResponseStatus(event, 404);
    },
});
</script>
