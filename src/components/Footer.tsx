import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <polygon points="20,4 6,34 34,34" stroke="url(#ft-grad-1)" strokeWidth="2.5" fill="none" />
                  <polygon points="20,12 12,28 28,28" fill="url(#ft-grad-2)" opacity="0.8" />
                  <circle cx="20" cy="4" r="2.5" fill="#28D7E5" />
                  <circle cx="6" cy="34" r="2.5" fill="#2388FF" />
                  <circle cx="34" cy="34" r="2.5" fill="#7B4DFF" />
                  <defs>
                    <linearGradient id="ft-grad-1" x1="0" y1="0" x2="40" y2="40">
                      <stop offset="0%" stopColor="#28D7E5" />
                      <stop offset="100%" stopColor="#7B4DFF" />
                    </linearGradient>
                    <linearGradient id="ft-grad-2" x1="0" y1="0" x2="40" y2="40">
                      <stop offset="0%" stopColor="#7B4DFF" />
                      <stop offset="100%" stopColor="#28D7E5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', color: '#FFFFFF' }}>
                Devs From <span className="text-cyan">Tomorrow</span>
              </span>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.6, maxWidth: '300px' }}>
              Desenvolvemos hoje as soluções digitais de amanhã. Especialistas em sistemas web, aplicativos mobile, automação n8n e inteligência artificial.
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: '#F5F7FA' }}>
              Navegação
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Início', href: '#hero' },
                { name: 'Soluções Digitais', href: '#solucoes' },
                { name: 'Automação n8n & IA', href: '#automacao' },
                { name: 'Diferenciais', href: '#diferenciais' },
                { name: 'Processo', href: '#processo' },
                { name: 'Tecnologias', href: '#tecnologias' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    style={{ fontSize: '14px', color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#28D7E5')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-gray)')}
                  >
                    {link.name}
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
                      href="#solucoes"
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
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 21, 36, 0.9)', border: '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gray)', transition: 'all 0.2s ease' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94Z"/></svg>
              </a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 21, 36, 0.9)', border: '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gray)', transition: 'all 0.2s ease' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 21, 36, 0.9)', border: '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gray)', transition: 'all 0.2s ease' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            </div>
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
          <div>© 2026 Devs From Tomorrow. Todos os direitos reservados.</div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ShieldCheck size={14} />
                <span>Área Administrativa</span>
              </button>
            )}
            <span>•</span>
            <a href="#" style={{ color: 'var(--text-gray)', textDecoration: 'none' }}>
              Política de privacidade
            </a>
            <span>•</span>
            <a href="#" style={{ color: 'var(--text-gray)', textDecoration: 'none' }}>
              Termos de uso
            </a>
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
    </footer>
  );
};

