import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 代理所有以/api开头的请求
      // vite 后端  不跨域
      '/api':{
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
