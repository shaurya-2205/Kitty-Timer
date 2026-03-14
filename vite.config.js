import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../docs', // For GitHub pages
    emptyOutDir: true,
  },
  plugins: [viteSingleFile()],
});
