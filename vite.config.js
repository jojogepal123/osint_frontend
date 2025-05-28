import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    minify:'terser',
    sourcemap: false,
    terserOptions:{
      compress: true,
      mangle: {
        toplevel: true,
        properties: true,
      },
      format:{
        comments: false,
      }
    }
  }
})
