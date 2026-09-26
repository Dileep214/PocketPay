import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendTarget = 'https://pocketpay-ejdi.onrender.com';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: true
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  }
});
