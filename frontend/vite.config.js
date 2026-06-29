import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/auth': 'http://localhost:7000',
      '/posts': 'http://localhost:7000',
      '/user': 'http://localhost:7000',
      '/profile': 'http://localhost:7000',
      '/streak': 'http://localhost:7000',
      '/messages': 'http://localhost:7000',
      '/feedback': 'http://localhost:7000',
      '/notifications': 'http://localhost:7000',
      '/group': 'http://localhost:7000',
      '/community': 'http://localhost:7000',
      '/events': 'http://localhost:7000',
      '/key': 'http://localhost:7000',
      '/uploads': 'http://localhost:7000',
      '/verify': 'http://localhost:7000',
    }
  },
})
