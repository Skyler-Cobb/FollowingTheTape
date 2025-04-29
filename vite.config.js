import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),   // injects Tailwind v4
    react()        // handles JSX, Fast Refresh, etc.
  ]
})