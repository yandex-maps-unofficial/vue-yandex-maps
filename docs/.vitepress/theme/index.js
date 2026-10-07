// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
    ...DefaultTheme,
    async enhanceApp({ app }) {
        if (!import.meta.env.SSR) {
            const { vaporInteropPlugin } = await import('vue')
            app.use(vaporInteropPlugin)
        }
    },
}
