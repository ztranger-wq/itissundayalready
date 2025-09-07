import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Define the backend URL here. Change this for deployment.
const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-api-gateway-url.amazonaws.com' // Change this to your production URL
  : ''; // Empty for dev so proxy works

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __API_BASE__: JSON.stringify(BACKEND_URL),
  },
  server: process.env.NODE_ENV !== 'production' ? {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  } : {},
})
