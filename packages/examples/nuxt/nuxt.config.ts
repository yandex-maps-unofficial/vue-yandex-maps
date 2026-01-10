export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ['vue-yandex-maps/nuxt'],
    yandexMaps: {
        apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
    },
    // You can use whatever syntax you like
    runtimeConfig: {
        public: {
            // @ts-expect-error didn't specify apikey
            yandexMaps: {
                scriptAttributes: {
                    referrerpolicy: false,
                },
            },
        },
    },
    typescript: {
        typeCheck: true,
        strict: true,
        shim: true,
    },
});
