import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../public', // Tell Vite where public assets are
  base: '/Kitty-Timer/',  // GitHub Pages base path
  build: {
    outDir: '../dist', // Must match deploy.yml: path: dist
    emptyOutDir: true,
  },
});
