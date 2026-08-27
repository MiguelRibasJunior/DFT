import React from 'react';
import { Bot, Cpu, Smartphone, Globe, Layers, Share2, ArrowUpRight } from 'lucide-react';

interface SolutionsProps {
  onSelectSolution: (solutionName: string) => void;
}

export const Solutions: React.FC<SolutionsProps> = ({ onSelectSolution }) => {
  const solutions = [
    {
      id: 'chatbots',
      icon: Bot,
      color: '#7B4DFF',
      title: 'Chatbots Inteligentes',
      description:
        'Chatbots personalizados para atendimento, suporte, vendas, captação de informações e comunicação automatizada.',
      badge: 'IA & Agentes',
    },
    {
      id: 'automacao',
      icon: Cpu,
      color: '#28D7E5',
      title: 'Automação com IA e n8n',
      description:
        'Automação de processos utilizando n8n, inteligência artificial, APIs e integrações entre diferentes plataformas.',
      badge: 'Eficiência n8n',
    },
    {
      id: 'aplicativos',
      icon: Smartphone,
      color: '#2388FF',
      title: 'Aplicativos',
      description:
        'Desenvolvimento de aplicativos modernos, intuitivos e responsivos para dispositivos Android e iOS.',
      badge: 'iOS & Android',
    },
    {
      id: 'sites',
      icon: Globe,
      color: '#28D7E5',
      title: 'Sites Institucionais',
      description:
        'Sites rápidos, responsivos e profissionais, desenvolvidos para fortalecer a presença digital de empresas e projetos.',
      badge: 'Alta Performance',
    },
    {
      id: 'sistemas',
      icon: Layers,
      color: '#7B4DFF',
      title: 'Sistemas Online',
      description:
        'Plataformas web personalizadas para gerenciamento de informações, processos, usuários, serviços e operações.',
      badge: 'SaaS & Dashboards',
    },
    {
      id: 'integracoes',
      icon: Share2,
      color: '#2388FF',
      title: 'Integrações e APIs',
      description:
        'Integração entre sistemas, bancos de dados, serviços externos e plataformas digitais por meio de APIs.',
      badge: 'Conectividade Total',
    },
  ];

  return (
    <section id="solucoes" style={{ padding: '100px 0', position: 'relative' }}>
      {/* Background Decor */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(40, 215, 229, 0.1) 0%, rgba(8, 11, 20, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

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
              background: 'rgba(35, 136, 255, 0.1)',
              border: '1px solid rgba(35, 136, 255, 0.3)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent-blue)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
            }}
          >
            Serviços Especializados
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: '16px' }}>
            Soluções digitais para diferentes desafios
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-gray)', lineHeight: 1.6 }}>
            Desenvolvemos produtos personalizados, conectando tecnologia, estratégia e experiência do usuário.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {solutions.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className="glass-card solution-card"
                onClick={() => onSelectSolution(item.title)}
                style={{
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  minHeight: '260px',
                }}
              >
                {/* Triangular Decor in Card Background */}
                <div
                  className="triangle-decor triangle-cyan"
                  style={{
                    top: '-10px',
                    right: '-10px',
                    transform: 'rotate(45deg)',
                  }}
                />

                <div>
                  {/* Top Row: Icon + Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div
                      className="icon-box"
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: `rgba(${
                          item.color === '#7B4DFF' ? '123, 77, 255' : item.color === '#28D7E5' ? '40, 215, 229' : '35, 136, 255'
                        }, 0.12)`,
                        border: `1px solid rgba(${
                          item.color === '#7B4DFF' ? '123, 77, 255' : item.color === '#28D7E5' ? '40, 215, 229' : '35, 136, 255'
                        }, 0.3)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <IconComp size={26} color={item.color} />
                    </div>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: 'rgba(41, 50, 71, 0.5)',
                        color: 'var(--text-gray)',
                        border: '1px solid rgba(41, 50, 71, 0.8)',
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#F5F7FA' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>

                {/* Bottom Arrow Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: item.color,
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(41, 50, 71, 0.4)',
                  }}
                >
                  <span>Saiba mais</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .solution-card:hover .icon-box {
          transform: scale(1.1) rotate(-4deg);
        }
      `}</style>
    </section>
  );
};
