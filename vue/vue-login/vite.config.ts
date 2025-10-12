import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), viteMockServe({
    mockPath: 'src/mock',
    localEnabled: true,
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
