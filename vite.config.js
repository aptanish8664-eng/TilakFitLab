import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static frontend only. No server, no API routes.
export default defineConfig({
  plugins: [react()],
  build: {
    // Never inline media as base64: keeps posters/thumbnails cacheable and the JS bundle lean.
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 700,
  },
});
