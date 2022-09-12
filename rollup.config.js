import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const getBuildSectionConfig = (format, file) => ({
  input: 'src/index.ts',
  output: {
    name: 'vue-yandex-maps',
    file,
    format,
    exports: 'named',
    sourcemap: true,
  },
  plugins: [typescript({ tsconfig: './tsconfig.json' }), terser()],
  external: ['vue'],
});

export default [
  getBuildSectionConfig('esm', pkg.main),
  getBuildSectionConfig('cjs', pkg.module),
];
