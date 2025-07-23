import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteMockServe } from "vite-plugin-mock";
// 模拟服务端 数据
// https://vite.dev/config/
// 前后端分离
export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: "mock",
      enable: true,
    }),
  ],
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "src"),
  //   },
  // },
});
