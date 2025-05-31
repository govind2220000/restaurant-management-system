import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
// Log the backend URL being used
console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000')

