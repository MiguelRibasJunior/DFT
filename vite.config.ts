import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/index.css', 'resources/js/main.tsx'],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './resources/js'),
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
  },
});
