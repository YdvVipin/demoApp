import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 6162,
    strictPort: true,
    // The SPA calls /api/* — proxy those to the demo API server (server.js on 6163).
    proxy: {
      '/api': { target: 'http://localhost:6163', changeOrigin: true },
    },
  },
})
