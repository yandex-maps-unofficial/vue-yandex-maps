<template>
    <div class="vue-yandex-maps-wrapper">
        <!-- @vue-ignore -->
        <slot
            :coordinates="coordinates"
            height="500px"
            :theme="theme"
            width="100%"
            :zoom="9"
        />
    </div>
</template>

<script setup lang="ts">
import { createYmapsOptions } from 'vue-yandex-maps';
import { computed } from 'vue';
import type { LngLat } from '@yandex/ymaps3-types';

const theme = computed<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';

    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
});

const coordinates: LngLat = [37.617644, 55.755819];

createYmapsOptions({
    apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
    servicesApikeys: {
        suggest: '78bc9294-13ad-4d98-b092-220daa9e3373',
        router: '074076a7-d9eb-488a-9061-1c6ba6e011aa',
    },
});
</script>

<style>
.vue-yandex-maps-wrapper {
  margin-top: 20px
}

.vue-yandex-maps-wrapper * {
  line-height: normal;
}

.vue-yandex-maps-wrapper .__ymap {
  border-radius: 8px;
  overflow: hidden;
}
</style>
