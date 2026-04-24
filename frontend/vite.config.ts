import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 🔥 IMPORTANT ADD
    proxy: {
      '/api': {
        target: 'http://localhost:9002',
        changeOrigin: true
      }
    }
  }
})