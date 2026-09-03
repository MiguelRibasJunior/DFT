import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#hero' },
    { name: 'Soluções', href: '#solucoes' },
    { name: 'Diferenciais', href: '#diferenciais' },
    { name: 'Processo', href: '#processo' },
    { name: 'Tecnologias', href: '#tecnologias' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(8, 11, 20, 0.92)'
          : 'linear-gradient(to bottom, rgba(8, 11, 20, 0.9), rgba(8, 11, 20, 0))',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(41, 50, 71, 0.6)' : '1px solid transparent',
        padding: scrolled ? '14px 0' : '20px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          {/* SVG Symbol: Connected Triangles */}
          <div style={{ position: 'relative', width: '36px', height: '36px' }}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <polygon points="20,4 6,34 34,34" stroke="url(#logo-grad-1)" strokeWidth="2.5" fill="none" />
              <polygon points="20,12 12,28 28,28" fill="url(#logo-grad-2)" opacity="0.8" />
              <circle cx="20" cy="4" r="2.5" fill="#28D7E5" />
              <circle cx="6" cy="34" r="2.5" fill="#2388FF" />
              <circle cx="34" cy="34" r="2.5" fill="#7B4DFF" />
              <line x1="20" y1="4" x2="20" y2="28" stroke="#28D7E5" strokeWidth="1" strokeDasharray="2 2" />
              <defs>
                <linearGradient id="logo-grad-1" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#28D7E5" />
                  <stop offset="50%" stopColor="#2388FF" />
                  <stop offset="100%" stopColor="#7B4DFF" />
                </linearGradient>
                <linearGradient id="logo-grad-2" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#7B4DFF" />
                  <stop offset="100%" stopColor="#28D7E5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '18px',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              Devs From <span className="text-cyan">Tomorrow</span>
            </span>
            <span
              style={{
                fontSize: '9px',
                color: 'var(--accent-blue)',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Digital Solutions & AI
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '32px', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                color: 'var(--text-gray)',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#28D7E5')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-gray)')}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Button & Admin Button */}
        <div style={{ display: 'none', alignItems: 'center', gap: '12px' }} className="desktop-nav">
          <a
            href="/admin"
            className="btn btn-secondary"
            style={{
              padding: '9px 16px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
            title="Abrir Painel Administrativo"
          >
            <ShieldCheck size={16} color="#28D7E5" />
            <span>Painel Admin</span>
          </a>

          <button onClick={onOpenQuote} className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }}>
            <span>Solicitar orçamento</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-white)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mobileMenuOpen ? <X size={26} color="#28D7E5" /> : <Menu size={26} color="#F5F7FA" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(10, 14, 26, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-gray)',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'var(--text-white)',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '8px 0',
                borderBottom: '1px solid rgba(41, 50, 71, 0.3)',
              }}
            >
              {link.name}
            </a>
          ))}
          <a
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '4px', justifyContent: 'center', textDecoration: 'none' }}
          >
            <ShieldCheck size={18} color="#28D7E5" />
            <span>Painel Admin</span>
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuote();
            }}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '4px' }}
          >
            <span>Solicitar orçamento</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Responsive Inline CSS for Navbar */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
