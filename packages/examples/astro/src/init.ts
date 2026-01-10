import type { App } from 'vue';
import { createYmaps } from 'vue-yandex-maps';

export default (app: App) => {
    app.use(createYmaps({
        apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
    }));
};
