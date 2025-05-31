import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Define environment variables that will be available at build time
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify("https://restaurant-management-system-q7hi.onrender.com")
  }
})

