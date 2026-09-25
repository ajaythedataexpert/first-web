import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/@react-pdf')) return 'pdf'
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) return 'three'
          return undefined
        },
      },
    },
  },
})
