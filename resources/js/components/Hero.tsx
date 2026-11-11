import React from 'react';
import { ArrowDownRight, Bot, Cpu, Code2, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '120px',
        paddingBottom: '80px',
        overflow: 'hidden',
      }}
      className="bg-digital-grid"
    >
      {/* Background Micro Triangle Accents */}
      <div className="triangle-decor triangle-cyan" aria-hidden="true" style={{ top: '15%', left: '3%', opacity: 0.25 }} />
      <div className="triangle-decor triangle-purple" aria-hidden="true" style={{ bottom: '12%', right: '4%', opacity: 0.25 }} />

      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(35, 136, 255, 0.15) 0%, rgba(8, 11, 20, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(123, 77, 255, 0.18) 0%, rgba(8, 11, 20, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid hero-grid-animate">
          {/* Left Column — Text & CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Pill Badge */}
            <div
              style={{
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '30px',
                background: 'rgba(40, 215, 229, 0.08)',
                border: '1px solid rgba(40, 215, 229, 0.3)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent-cyan)',
              }}
            >
              <Sparkles size={14} className="text-cyan" />
              <span>Inovação • Automação n8n • Inteligência Artificial</span>
            </div>

            {/* Main Title */}
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 800,
                lineHeight: 1.12,
                color: '#F5F7FA',
              }}
            >
              Desenvolvemos hoje as{' '}
              <span className="text-gradient">soluções digitais</span> de amanhã.
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: 'clamp(16px, 1.8vw, 18px)',
                color: 'var(--text-gray)',
                maxWidth: '600px',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Criamos aplicativos, sistemas, sites, chatbots e automações inteligentes para transformar ideias em experiências digitais eficientes, modernas e escaláveis.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
              <a href="#solucoes" className="btn btn-primary">
                <span>Conheça nossas soluções</span>
                <ArrowDownRight size={18} />
              </a>

              <a href="#contato" onClick={onOpenQuote} className="btn btn-secondary">
                <MessageSquare size={18} className="text-cyan" />
                <span>Fale com nossa equipe</span>
              </a>
            </div>

            {/* Small Footer Tagline */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(41, 50, 71, 0.4)',
                fontSize: '13px',
                color: 'var(--text-gray)',
              }}
            >
              <CheckCircle2 size={16} color="#28D7E5" />
              <span>Tecnologia, automação e inteligência para impulsionar negócios.</span>
            </div>
          </div>

          {/* Right Column — Abstract Interactive Geometric Composition */}
          <div
            className="hero-interactive-zone"
            style={{
              position: 'relative',
              minHeight: 'clamp(320px, 75vw, 440px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              overflow: 'visible',
            }}
          >
            {/* Outer Geometric Frame & Triangles */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                height: 'clamp(320px, 75vw, 440px)',
                overflow: 'visible',
              }}
            >
              
              {/* Central Glowing Triangle Composite SVG */}
              <svg viewBox="0 0 500 450" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 25px rgba(35, 136, 255, 0.25))' }}>
                {/* Background Grid Mesh Lines */}
                <line x1="50" y1="225" x2="450" y2="225" stroke="#293247" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                <line x1="250" y1="50" x2="250" y2="400" stroke="#293247" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                
                {/* Floating Central Triangle Structure */}
                <g className="hero-triangle-group">
                  {/* Outer Large Triangular Contour */}
                  <polygon points="250,30 450,390 50,390" stroke="url(#hero-tri-grad-1)" strokeWidth="2" fill="none" opacity="0.6" />

                  {/* Connecting Vertex Nodes */}
                  <circle cx="250" cy="30" r="5" fill="#28D7E5" />
                  <circle cx="450" cy="390" r="5" fill="#7B4DFF" />
                  <circle cx="50" cy="390" r="5" fill="#2388FF" />
                  <circle cx="250" cy="150" r="4" fill="#FFFFFF" />

                  {/* Internal Floating Layers & Dynamic Lines */}
                  <g className="hero-triangle-internal">
                    {/* Inner Triangles Group — Flutuação suave vertical (respiração) */}
                    <g className="hero-inner-triangles">
                      {/* Inner Layer Triangle 2 */}
                      <polygon
                        className="hero-flow-triangle"
                        points="250,90 400,360 100,360"
                        stroke="url(#hero-tri-grad-2)"
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        fill="rgba(123, 77, 255, 0.03)"
                      />

                      {/* Inner Small Solid Triangle */}
                      <polygon points="250,150 330,310 170,310" fill="url(#hero-tri-grad-3)" opacity="0.25" />
                    </g>

                    {/* Rays & Data Lines */}
                    <line className="hero-flow-ray" x1="250" y1="30" x2="250" y2="150" stroke="#28D7E5" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line className="hero-flow-ray" x1="50" y1="390" x2="170" y2="310" stroke="#2388FF" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line className="hero-flow-ray" x1="450" y1="390" x2="330" y2="310" stroke="#7B4DFF" strokeWidth="1.5" strokeDasharray="3 3" />
                  </g>
                </g>

                <defs>
                  <linearGradient id="hero-tri-grad-1" x1="50" y1="30" x2="450" y2="390">
                    <stop offset="0%" stopColor="#28D7E5" />
                    <stop offset="50%" stopColor="#2388FF" />
                    <stop offset="100%" stopColor="#7B4DFF" />
                  </linearGradient>
                  <linearGradient id="hero-tri-grad-2" x1="100" y1="90" x2="400" y2="360">
                    <stop offset="0%" stopColor="#7B4DFF" />
                    <stop offset="100%" stopColor="#28D7E5" />
                  </linearGradient>
                  <linearGradient id="hero-tri-grad-3" x1="170" y1="150" x2="330" y2="310">
                    <stop offset="0%" stopColor="#2388FF" />
                    <stop offset="100%" stopColor="#7B4DFF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating UI Card 1 — Automação n8n & IA */}
              <div
                className="hero-floating-card hero-floating-card-1 rounded-full"
                style={{
                  top: '30px',
                  right: '10px',
                  borderRadius: '9999px',
                }}
              >
                <Cpu size={16} color="#28D7E5" />
                <span>Automação n8n & IA</span>
                <span className="hero-neon-dot" />
              </div>

              {/* Floating UI Card 2 — Agente IA WhatsApp */}
              <div
                className="hero-floating-card hero-floating-card-2 rounded-full"
                style={{
                  bottom: '55px',
                  left: '10px',
                  borderRadius: '9999px',
                }}
              >
                <Bot size={16} color="#A78BFA" />
                <span>Agente IA WhatsApp</span>
                <span className="hero-neon-dot" />
              </div>

              {/* Floating UI Card 3 — REST & GraphQL APIs */}
              <div
                className="hero-floating-card hero-floating-card-3 rounded-full"
                style={{
                  bottom: '12px',
                  right: '30px',
                  borderRadius: '9999px',
                }}
              >
                <Code2 size={16} color="#60A5FA" />
                <span>REST & GraphQL APIs</span>
                <span className="hero-neon-dot" />
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }
        @media (min-width: 992px) {
          .hero-grid {
            grid-template-columns: 1.15fr 0.85fr;
            gap: 48px;
          }
        }
        .hero-grid-animate {
          animation: heroReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-grid-animate {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};
