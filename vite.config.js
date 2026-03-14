import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/',           // Custom domain — assets served from root
  build: {
    outDir: '../dist', // Must match deploy.yml: path: dist
    emptyOutDir: true,
  },
});
