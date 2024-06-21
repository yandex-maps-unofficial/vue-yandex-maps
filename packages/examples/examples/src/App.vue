<template>
    <example-component/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ExampleComponent from './CommonExamples.vue';

export default defineComponent({
    name: 'App',
    components: {
        ExampleComponent,
    },
});
</script>
