import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Versión de un solo archivo HTML, para abrir con doble clic (file://) sin servidor.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { outDir: '/tmp/single-out', emptyOutDir: true, chunkSizeWarningLimit: 10000 },
});
