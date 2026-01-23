import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  // Для Netlify лучше использовать стандартный корень '/', если вы не деплоите в подпапку
  base: '/',
})
