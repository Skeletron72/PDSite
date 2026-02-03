import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  // Для GitHub Pages используем имя репозитория. Для Netlify можно оставить '/'
  base: '/PDSite/',
})
