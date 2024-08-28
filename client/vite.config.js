import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // String starts with '/api' will be handled by the proxy 
      // Example: /api/auth/signup -> http://localhost:3000/api/auth/signup
      '/api':{
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
})
