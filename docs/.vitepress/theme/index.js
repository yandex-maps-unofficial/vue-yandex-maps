// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { vaporInteropPlugin } from 'vue'
import './custom.css'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.use(vaporInteropPlugin)
    },
}
