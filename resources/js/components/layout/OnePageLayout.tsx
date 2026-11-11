import React from 'react';
import { GeometricCanvas } from './GeometricCanvas';
import { Header } from './header/Header';

const MAIN_CONTENT_ID = 'conteudo';

interface OnePageLayoutProps {
  /** Seções da página, na ordem em que devem aparecer. */
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Modais e camadas sobrepostas: ficam fora do <main> para não herdar o z-index dele. */
  overlays?: React.ReactNode;
}

/**
 * Esqueleto da one page pública: fundo animado, header fixo, conteúdo principal e rodapé.
 * Não conhece as seções — quem monta a página (pages/HomePage) decide o que entra no <main>.
 */
export const OnePageLayout: React.FC<OnePageLayoutProps> = ({ children, footer, overlays }) => (
  <div className="one-page">
    <a href={`#${MAIN_CONTENT_ID}`} className="skip-link">
      Pular para o conteúdo
    </a>

    <GeometricCanvas />
    <Header />

    <main id={MAIN_CONTENT_ID} tabIndex={-1} className="one-page__main">
      {children}
    </main>

    {footer}
    {overlays}
  </div>
);
