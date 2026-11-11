import React, { useState } from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import type { PublicContactLink, PublicSiteSettings } from '../../services/contentService';
import { CONTACT_COLORS, ContactIcon } from '../ui/ContactIcon';
import { LegalModal } from '../modals/LegalModal';
import { Logo } from '../ui/Logo';
import { SECTION_IDS, sectionHref } from '../../config/sections';
import { handleAnchorClick, prefersReducedMotion } from '../../utils/scroll';

interface FooterProps {
  settings?: PublicSiteSettings | null;
  // undefined = carregando, null = falha na API (usa os canais padrão), lista = canais ativos do admin
  contactLinks?: PublicContactLink[] | null;
}

const isExternal = (url: string) => /^https?:\/\//i.test(url);

// Espelha SiteSetting::DEFAULT_FOOTER_LINKS (usado quando a API não responde).
const FALLBACK_NAV_LINKS = [
  { label: 'Início', url: sectionHref(SECTION_IDS.hero) },
  { label: 'Soluções Digitais', url: sectionHref(SECTION_IDS.solucoes) },
  { label: 'Automação n8n & IA', url: sectionHref(SECTION_IDS.automacao) },
  { label: 'Diferenciais', url: sectionHref(SECTION_IDS.diferenciais) },
  { label: 'Processo', url: sectionHref(SECTION_IDS.processo) },
  { label: 'Tecnologias', url: sectionHref(SECTION_IDS.tecnologias) },
];

const FALLBACK_SOCIAL_LINKS: PublicContactLink[] = [
  { id: -1, type: 'instagram', label: 'Instagram', value: '', href: 'https://www.instagram.com/devsfromtomorrow/' },
  { id: -2, type: 'linkedin', label: 'LinkedIn', value: '', href: 'https://www.linkedin.com/company/devs-from-tomorrow' },
  { id: -3, type: 'github', label: 'GitHub', value: '', href: 'https://github.com/devs-from-tomorrow' },
];

export const Footer: React.FC<FooterProps> = ({ settings, contactLinks }) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const navLinks = settings?.footer_links ?? FALLBACK_NAV_LINKS;
  const socialLinks = contactLinks === null ? FALLBACK_SOCIAL_LINKS : contactLinks ?? [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const linkButtonStyle: React.CSSProperties = {
    color: 'var(--text-gray)',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
    font: 'inherit',
    cursor: 'pointer',
  };

  return (
    <footer
      style={{
        background: '#04060B',
        borderTop: '1px solid rgba(41, 50, 71, 0.6)',
        paddingTop: '70px',
        paddingBottom: '36px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Micro Geometric Accents */}
      <div className="triangle-decor triangle-cyan" style={{ bottom: '20px', left: '4%', transform: 'rotate(15deg)', opacity: 0.08 }} />
      <div className="triangle-decor triangle-purple" style={{ top: '30px', right: '5%', transform: 'rotate(-30deg)', opacity: 0.08 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '60px',
          }}
        >
          {/* Col 1 — Logo & Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Logo size={32} showTagline={false} />

            <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.6, maxWidth: '300px' }}>
              {settings?.description || 'Desenvolvemos hoje as soluções digitais de amanhã. Especialistas em sistemas web, aplicativos mobile, automação n8n e inteligência artificial.'}
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: '#F5F7FA' }}>
              Navegação
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {navLinks.map((link, index) => (
                <li key={`${link.url}-${index}`}>
                  <a
                    href={link.url}
                    onClick={handleAnchorClick}
                    target={isExternal(link.url) ? '_blank' : undefined}
                    rel={isExternal(link.url) ? 'noopener noreferrer' : undefined}
                    style={{ fontSize: '14px', color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#28D7E5')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-gray)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Soluções */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: '#F5F7FA' }}>
              Soluções
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Chatbots Inteligentes', 'Automação n8n', 'Aplicativos Android & iOS', 'Sites Institucionais', 'Sistemas Online', 'Integrações via APIs'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={sectionHref(SECTION_IDS.solucoes)}
                      onClick={handleAnchorClick}
                      style={{ fontSize: '14px', color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#28D7E5')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-gray)')}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Col 4 — Redes & Contato */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: '#F5F7FA' }}>
              Conecte-se
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '16px' }}>
              Acompanhe nossas novidades e soluções em nossas redes oficiais.
            </p>
            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                {socialLinks.map((link) => {
                  const accent = CONTACT_COLORS[link.type] ?? '#28D7E5';
                  const external = /^https?:\/\//i.test(link.href);

                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      aria-label={link.label}
                      title={link.label}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(16, 21, 36, 0.9)',
                        border: '1px solid var(--border-gray)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-gray)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = accent;
                        e.currentTarget.style.color = accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-gray)';
                        e.currentTarget.style.color = 'var(--text-gray)';
                      }}
                    >
                      <ContactIcon type={link.type} size={20} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(41, 50, 71, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '13px',
            color: 'var(--text-gray)',
          }}
        >
          <div>{settings?.copyright_text || '© 2026 Devs From Tomorrow. Todos os direitos reservados.'}</div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a
              href="/admin"
              style={{
                color: 'var(--accent-cyan)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ShieldCheck size={14} />
              <span>Área Administrativa</span>
            </a>
            <span>•</span>
            <button type="button" onClick={() => setLegalModal('privacy')} style={linkButtonStyle}>
              Política de privacidade
            </button>
            <span>•</span>
            <button type="button" onClick={() => setLegalModal('terms')} style={linkButtonStyle}>
              Termos de uso
            </button>
          </div>

          <button
            onClick={scrollToTop}
            style={{
              background: 'rgba(16, 21, 36, 0.9)',
              border: '1px solid var(--border-gray)',
              color: '#F5F7FA',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            title="Voltar ao topo"
          >
            <ArrowUp size={16} color="#28D7E5" />
          </button>
        </div>
      </div>

      <LegalModal
        isOpen={legalModal === 'privacy'}
        onClose={() => setLegalModal(null)}
        title="Política de privacidade"
        content={settings?.privacy_policy ?? null}
      />
      <LegalModal
        isOpen={legalModal === 'terms'}
        onClose={() => setLegalModal(null)}
        title="Termos de uso"
        content={settings?.terms_of_use ?? null}
      />
    </footer>
  );
};
