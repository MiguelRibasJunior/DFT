
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import '../css/index.css';
import App from './App';

// Detecta se a página foi entregue pelo backend Laravel com o container e payload do Inertia
const inertiaContainer = typeof document !== 'undefined' ? document.getElementById('app') : null;
const hasInertiaPayload = typeof document !== 'undefined'
  ? Boolean(document.querySelector('script[data-page="app"], script[data-page], [data-page]'))
  : false;

if (inertiaContainer && hasInertiaPayload) {
  // Modo Integrado Laravel + Inertia.js
  createInertiaApp({
    pages: {
      path: './Pages',
      extension: '.tsx',
    },
    setup({ el, App: InertiaApp, props }) {
      if (el) {
        createRoot(el).render(<InertiaApp {...props} />);
      }
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
} else if (typeof document !== 'undefined') {
  // Modo SPA autônomo (Vite dev server direto via index.html ou fallback)
  const rootElement = document.getElementById('root') || document.getElementById('app') || document.body;
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}
