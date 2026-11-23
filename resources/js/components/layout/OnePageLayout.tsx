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
  /** Logo e nome do site vindos do admin (Configurações → Geral). */
  logoUrl?: string | null;
  siteName?: string;
}

/**
 * Esqueleto da one page pública: fundo animado, header fixo, conteúdo principal e rodapé.
 * Não conhece as seções — quem monta a página (pages/HomePage) decide o que entra no <main>.
 */
export const OnePageLayout: React.FC<OnePageLayoutProps> = ({ children, footer, overlays, logoUrl, siteName }) => (
  <div className="one-page">
    <a href={`#${MAIN_CONTENT_ID}`} className="skip-link">
      Pular para o conteúdo
    </a>

    <GeometricCanvas />
    <Header logoUrl={logoUrl} siteName={siteName} />

    <main id={MAIN_CONTENT_ID} tabIndex={-1} className="one-page__main">
      {children}
    </main>

    {footer}
    {overlays}
  </div>
);
