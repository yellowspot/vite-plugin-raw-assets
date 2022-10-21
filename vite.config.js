// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: ['vite', 'node:fs']
    }
  }
})
