
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import inertia from '@inertiajs/vite';
import path from 'path';

export default defineConfig(async ({ mode }) => {
  const isLaravel =
    process.env.LARAVEL === 'true' || mode === 'laravel';

  let tailwindPlugin: any = null;

  try {
    // @ts-ignore
    const tailwindModule = await import('@tailwindcss/vite');
    tailwindPlugin = tailwindModule.default;
  } catch {
    // Tailwind será carregado quando estiver instalado.
  }

  return {
    plugins: [
      ...(tailwindPlugin ? [tailwindPlugin()] : []),

      ...(isLaravel
        ? [
          laravel({
            input: [
              'resources/css/index.css',
              'resources/js/main.tsx',
            ],
            refresh: true,
          }),
          inertia(),
        ]
        : []),

      react(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './resources/js'),
      },
    },

    server: {
      host: 'localhost',
      port: isLaravel ? 3000 : 8000,
    },
  };
});
