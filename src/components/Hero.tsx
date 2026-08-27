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
        <div className="hero-grid">
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
          <div style={{ position: 'relative', minHeight: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Outer Geometric Frame & Triangles */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '520px', height: '440px' }}>
              
              {/* Central Glowing Triangle Composite SVG */}
              <svg viewBox="0 0 500 450" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 25px rgba(35, 136, 255, 0.25))' }}>
                {/* Background Grid Mesh Lines */}
                <line x1="50" y1="225" x2="450" y2="225" stroke="#293247" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="250" y1="50" x2="250" y2="400" stroke="#293247" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Outer Large Triangular Contour */}
                <polygon points="250,30 450,390 50,390" stroke="url(#hero-tri-grad-1)" strokeWidth="2" fill="none" opacity="0.6" />

                {/* Inner Layer Triangle 2 */}
                <polygon points="250,90 400,360 100,360" stroke="url(#hero-tri-grad-2)" strokeWidth="1.5" strokeDasharray="6 6" fill="rgba(123, 77, 255, 0.03)" />

                {/* Inner Small Solid Triangle */}
                <polygon points="250,150 330,310 170,310" fill="url(#hero-tri-grad-3)" opacity="0.25" />

                {/* Connecting Vertex Nodes */}
                <circle cx="250" cy="30" r="5" fill="#28D7E5" />
                <circle cx="450" cy="390" r="5" fill="#7B4DFF" />
                <circle cx="50" cy="390" r="5" fill="#2388FF" />
                <circle cx="250" cy="150" r="4" fill="#FFFFFF" />

                {/* Rays & Data Lines */}
                <line x1="250" y1="30" x2="250" y2="150" stroke="#28D7E5" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="50" y1="390" x2="170" y2="310" stroke="#2388FF" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="450" y1="390" x2="330" y2="310" stroke="#7B4DFF" strokeWidth="1.5" strokeDasharray="3 3" />

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

              {/* Floating UI Card 1 — n8n & IA Workflow */}
              <div
                className="glass-card animate-float"
                style={{
                  position: 'absolute',
                  top: '40px',
                  right: '-10px',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  background: 'rgba(16, 21, 36, 0.88)',
                  borderColor: 'rgba(40, 215, 229, 0.4)',
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(40, 215, 229, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={20} color="#28D7E5" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Automação n8n & IA</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Fluxo Ativo • 99.9%</div>
                </div>
              </div>

              {/* Floating UI Card 2 — Chatbot Inteligente */}
              <div
                className="glass-card animate-float-slow"
                style={{
                  position: 'absolute',
                  bottom: '50px',
                  left: '-20px',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  background: 'rgba(16, 21, 36, 0.88)',
                  borderColor: 'rgba(123, 77, 255, 0.4)',
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(123, 77, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={20} color="#7B4DFF" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Agente IA WhatsApp</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>+1.450 Atendimentos/dia</div>
                </div>
              </div>

              {/* Floating UI Card 3 — High Speed APIs & Code */}
              <div
                className="glass-card"
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '20px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(16, 21, 36, 0.85)',
                  borderColor: 'rgba(35, 136, 255, 0.35)',
                }}
              >
                <Code2 size={16} color="#2388FF" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#F5F7FA' }}>REST & GraphQL APIs</span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28D7E5', boxShadow: '0 0 8px #28D7E5' }} />
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
      `}</style>
    </section>
  );
};
