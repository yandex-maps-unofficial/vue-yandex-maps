import { cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

cpSync(
  join(__dirname, '../../README.md'),
  join(__dirname, './README.md'),
);

cpSync(
  join(__dirname, '../../CHANGELOG.md'),
  join(__dirname, './CHANGELOG.md'),
);

cpSync(
  join(__dirname, '../../LICENSE'),
  join(__dirname, './LICENSE'),
);

cpSync(
  join(__dirname, 'src/plugins/nuxt2-plugin.js'),
  join(__dirname, 'dist/plugins/nuxt2-plugin.js'),
);

cpSync(
  join(__dirname, '../nuxt/dist'),
  join(__dirname, 'dist/nuxt'),
  {
    force: true,
    recursive: true,
  },
);
