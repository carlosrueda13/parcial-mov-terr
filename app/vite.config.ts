import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El contenido (fichas y banco) vive en ../content y se importa en tiempo de build.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true, fs: { allow: ['..'] } },
  build: { chunkSizeWarningLimit: 1500 },
});
