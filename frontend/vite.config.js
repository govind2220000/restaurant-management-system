import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify("https://restaurant-management-system-q7hi.onrender.com")
  }
})

