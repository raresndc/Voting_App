// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all /api requests to your backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // If your backend paths already include /api, you don’t need rewrite.
        // If your backend is mounted at the root (no /api prefix), uncomment the next line:
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/logos': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
