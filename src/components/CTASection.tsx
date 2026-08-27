import React from 'react';
import { ArrowRight, Sparkles, Send } from 'lucide-react';

interface CTASectionProps {
  onStartProject: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onStartProject }) => {
  return (
    <section
      style={{
        padding: '110px 0',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(35, 136, 255, 0.12) 0%, rgba(123, 77, 255, 0.15) 100%)',
      }}
    >
      {/* Translucent Large Geometric Triangle SVG in Background */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '900px',
          height: '450px',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      >
        <svg viewBox="0 0 900 450" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {/* Main Large Translucent Triangle */}
          <polygon points="450,20 850,420 50,420" stroke="url(#cta-tri-grad)" strokeWidth="2" strokeDasharray="8 8" fill="rgba(40, 215, 229, 0.03)" />
          
          {/* Inner Triangle */}
          <polygon points="450,110 750,380 150,380" stroke="url(#cta-tri-grad-2)" strokeWidth="1" strokeDasharray="4 4" fill="rgba(123, 77, 255, 0.04)" />

          {/* Connected Points */}
          <circle cx="450" cy="20" r="6" fill="#28D7E5" />
          <circle cx="850" cy="420" r="6" fill="#7B4DFF" />
          <circle cx="50" cy="420" r="6" fill="#2388FF" />
          <circle cx="450" cy="110" r="4" fill="#FFFFFF" />

          {/* Connecting rays */}
          <line x1="450" y1="20" x2="450" y2="110" stroke="#28D7E5" strokeWidth="1.5" />
          <line x1="50" y1="420" x2="150" y2="380" stroke="#2388FF" strokeWidth="1.5" />
          <line x1="850" y1="420" x2="750" y2="380" stroke="#7B4DFF" strokeWidth="1.5" />

          <defs>
            <linearGradient id="cta-tri-grad" x1="50" y1="20" x2="850" y2="420">
              <stop offset="0%" stopColor="#28D7E5" />
              <stop offset="50%" stopColor="#2388FF" />
              <stop offset="100%" stopColor="#7B4DFF" />
            </linearGradient>
            <linearGradient id="cta-tri-grad-2" x1="150" y1="110" x2="750" y2="380">
              <stop offset="0%" stopColor="#7B4DFF" />
              <stop offset="100%" stopColor="#28D7E5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '820px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(40, 215, 229, 0.15)',
            border: '1px solid rgba(40, 215, 229, 0.4)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--accent-cyan)',
            marginBottom: '20px',
          }}
        >
          <Sparkles size={16} />
          <span>Transforme sua Empresa</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(30px, 4.5vw, 48px)',
            fontWeight: 800,
            marginBottom: '20px',
            lineHeight: 1.15,
          }}
        >
          Tem uma ideia? Vamos transformá-la em uma <span className="text-gradient">solução digital</span>.
        </h2>

        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            color: 'var(--text-gray)',
            lineHeight: 1.6,
            marginBottom: '36px',
            maxWidth: '680px',
            margin: '0 auto 36px',
          }}
        >
          Conte um pouco sobre seu projeto, processo ou necessidade. Nossa equipe entrará em contato para entender como a tecnologia pode ajudar.
        </p>

        <a href="#contato" onClick={onStartProject} className="btn btn-primary btn-glow" style={{ padding: '16px 36px', fontSize: '16px' }}>
          <Send size={18} />
          <span>Iniciar um projeto</span>
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};
