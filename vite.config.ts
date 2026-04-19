import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'https://mcp.saacs.com.br',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
