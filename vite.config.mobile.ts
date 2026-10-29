import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Dedicated Mobile Server Configuration - Port 3001
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'mobile-default-entry',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '') {
            req.url = '/mobile.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    port: 3005,
    open: false,
  },
});
