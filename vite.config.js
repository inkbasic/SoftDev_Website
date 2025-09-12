import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// shadcn
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // ทุก request ที่เริ่มด้วย /auth จะถูกส่งไป backend localhost:3000
      "/auth": {
        target: "http://localhost:3000", // backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});