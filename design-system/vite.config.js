import { copyFile, cp } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = new URL('.', import.meta.url);
const sourceRoot = fileURLToPath(root);

export default defineConfig({
  base: './',
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        index: resolve(sourceRoot, 'index.html'),
        preview: resolve(sourceRoot, 'preview.html'),
        notFound: resolve(sourceRoot, '404.html'),
      },
    },
  },
  plugins: [{
    name: 'copy-static-catalog-assets',
    async writeBundle() {
      await Promise.all([
        copyFile(new URL('component-manifest.json', root), new URL('dist/component-manifest.json', root)),
        copyFile(new URL('staticwebapp.config.json', root), new URL('dist/staticwebapp.config.json', root)),
        copyFile(new URL('README.md', root), new URL('dist/README.md', root)),
        cp(new URL('components/', root), new URL('dist/components/', root), { recursive: true }),
        cp(new URL('foundations/', root), new URL('dist/foundations/', root), { recursive: true }),
        cp(new URL('images/', root), new URL('dist/images/', root), { recursive: true }),
      ]);
    },
  }],
});
