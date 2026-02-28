import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // listen on all addresses, equivalent to 0.0.0.0
    port: 80,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://api:3000',
        changeOrigin: true,
      },
    },
  },
})
