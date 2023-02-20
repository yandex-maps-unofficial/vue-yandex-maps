import path from 'path';
import vue from '@vitejs/plugin-vue';

export default {
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    includeSource: ['src/**/*.{js,ts,vue}'],
    exclude: ['node_modules'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '`src`': path.resolve(__dirname, './src'),
    },
  },
};
