import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/',           // Custom domain — assets served from root
  build: {
    outDir: '../docs', // GitHub Pages source folder
    emptyOutDir: true,
  },
});
