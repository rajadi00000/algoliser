import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH is injected by CI (GitHub Actions) for GitHub Pages sub-path hosting.
// Falls back to '/' for local dev and direct domain deployments (Vercel, Netlify, etc.).
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? '/',
})
