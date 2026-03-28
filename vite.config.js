import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../public', // Tell Vite where public assets are
  base: './',             // Relative asset paths for Pages/custom-domain/static preview
  build: {
    outDir: '../dist', // Must match deploy.yml: path: dist
    emptyOutDir: true,
  },
});
