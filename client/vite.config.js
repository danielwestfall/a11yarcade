import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/canvas-confetti/')) {
            return 'vendor-confetti';
          }
          if (id.includes('node_modules/socket.io') || id.includes('node_modules/engine.io') || id.includes('node_modules/qrcode')) {
            return 'vendor-realtime';
          }
          if (id.includes('src/data/academy/')) {
            return 'academy-curriculum-data';
          }
          if (id.includes('cpacc.json')) {
            return 'bank-cpacc';
          }
          if (id.includes('was.json')) {
            return 'bank-was';
          }
          if (id.includes('ads-1.json')) {
            return 'bank-ads-1';
          }
          if (id.includes('ads-2.json')) {
            return 'bank-ads-2';
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true
      }
    }
  }
})
