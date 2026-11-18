
import { createInertiaApp, router } from '@inertiajs/react';

createInertiaApp({
  pages: {
    path: './Pages',
    extension: '.tsx',
  },
  progress: {
    color: '#28D7E5',
    showSpinner: true,
  },
  strictMode: true,
});

// Tratamento de diagnósticos e erros de integração em ambiente de desenvolvimento local
if (import.meta.env.DEV) {
  router.on('httpException', (event) => {
    console.error('[Inertia Dev] Exceção HTTP recebida:', event.detail.response);
  });
  router.on('networkError', (event) => {
    console.error('[Inertia Dev] Erro de rede na requisição Inertia:', event.detail.error);
  });
}
