import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// shadcn
import path from "path"

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  console.log("VITE_PUBLIC_API_URL:", process.env.VITE_PUBLIC_API_URL);

  return defineConfig({
    plugins: [react(), tailwind()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/auth": {
          target: process.env.VITE_PUBLIC_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        '/places': {
          target: process.env.VITE_PUBLIC_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        '/users': {
          target: process.env.VITE_PUBLIC_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        "/plans": {
          target: process.env.VITE_PUBLIC_API_URL || "http://localhost:3000",
          changeOrigin: true,
        },
        "/tags": {
          target: process.env.VITE_PUBLIC_API_URL || "http://localhost:3000",
          changeOrigin: true,
        },
        "/ad": {
          target: process.env.VITE_PUBLIC_API_URL || "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  });
}