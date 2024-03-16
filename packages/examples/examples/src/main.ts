import { createApp } from 'vue';
import { createYmaps } from 'vue-yandex-maps';
import App from './App.vue';

const app = createApp(App);

const ymaps = createYmaps({
  apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
  defaultApikeys: {
    suggest: '78bc9294-13ad-4d98-b092-220daa9e3373',
    router: '074076a7-d9eb-488a-9061-1c6ba6e011aa',
  },
});

app.use(ymaps);
app.mount('#app');
