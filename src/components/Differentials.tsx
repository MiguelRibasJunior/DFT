import React from 'react';
import { Target, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export const Differentials: React.FC = () => {
  const items = [
    {
      num: '01',
      icon: Target,
      color: '#2388FF',
      title: 'Soluções personalizadas',
      description: 'Cada projeto é desenvolvido de acordo com as necessidades, processos e objetivos do cliente.',
    },
    {
      num: '02',
      icon: ShieldCheck,
      color: '#28D7E5',
      title: 'Tecnologias modernas',
      description: 'Utilizamos ferramentas e arquiteturas atuais para criar soluções seguras, rápidas e escaláveis.',
    },
    {
      num: '03',
      icon: Sparkles,
      color: '#7B4DFF',
      title: 'Experiência do usuário',
      description: 'Criamos interfaces simples, intuitivas e agradáveis, facilitando a utilização dos produtos digitais.',
    },
    {
      num: '04',
      icon: TrendingUp,
      color: '#2388FF',
      title: 'Evolução contínua',
      description: 'Os sistemas podem crescer e receber novas funcionalidades conforme as necessidades do negócio.',
    },
  ];

  return (
    <section id="diferenciais" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'rgba(40, 215, 229, 0.1)',
              border: '1px solid rgba(40, 215, 229, 0.3)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
            }}
          >
            Nossas Vantagens
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800 }}>
            Por que escolher a <span className="text-gradient">Devs From Tomorrow</span>?
          </h2>
        </div>

        {/* 4 Differentials Grid with Triangular Connectors */}
        <div style={{ position: 'relative' }}>
          {/* Decorative Connecting Lines & Central Triangle SVG */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '800px',
              height: '300px',
              pointerEvents: 'none',
              zIndex: 0,
              display: 'none',
            }}
            className="connecting-lines-desktop"
          >
            <svg viewBox="0 0 800 300" fill="none" style={{ width: '100%', height: '100%' }}>
              <polygon points="400,20 750,280 50,280" stroke="url(#diff-tri)" strokeWidth="1.5" strokeDasharray="6 6" fill="none" opacity="0.3" />
              <line x1="200" y1="80" x2="600" y2="80" stroke="#28D7E5" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <line x1="200" y1="220" x2="600" y2="220" stroke="#7B4DFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <defs>
                <linearGradient id="diff-tri" x1="0" y1="0" x2="800" y2="300">
                  <stop offset="0%" stopColor="#28D7E5" />
                  <stop offset="100%" stopColor="#7B4DFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '28px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {items.map((diff) => {
              const IconComponent = diff.icon;
              return (
                <div
                  key={diff.num}
                  className="glass-card"
                  style={{
                    padding: '32px 26px',
                    position: 'relative',
                    background: 'rgba(16, 21, 36, 0.8)',
                  }}
                >
                  {/* Floating Micro-Triangle Accent */}
                  <div
                    className="triangle-decor triangle-cyan"
                    style={{
                      bottom: '15px',
                      right: '15px',
                      transform: 'rotate(-20deg)',
                    }}
                  />

                  {/* Header Row: Icon & Number */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `rgba(${
                          diff.color === '#7B4DFF' ? '123, 77, 255' : diff.color === '#28D7E5' ? '40, 215, 229' : '35, 136, 255'
                        }, 0.12)`,
                        border: `1px solid ${diff.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent size={24} color={diff.color} />
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '28px',
                        fontWeight: 800,
                        color: 'rgba(41, 50, 71, 0.7)',
                      }}
                    >
                      {diff.num}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '12px', color: '#F5F7FA' }}>
                    {diff.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.6 }}>
                    {diff.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .connecting-lines-desktop {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
};
