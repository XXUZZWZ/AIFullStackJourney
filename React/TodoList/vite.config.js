import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // vite 工程化套件

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
