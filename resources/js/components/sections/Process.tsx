import React from 'react';
import { Search, Compass, Palette, Code, CheckCircle, Rocket } from 'lucide-react';
import { SECTION_IDS } from '../../config/sections';
import { SectionHeading } from '../ui/SectionHeading';

export const Process: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Entendimento',
      description: 'Levantamento das necessidades, objetivos e características do projeto.',
      icon: Search,
    },
    {
      num: 2,
      title: 'Planejamento',
      description: 'Definição das funcionalidades, tecnologias, prazos e estrutura da solução.',
      icon: Compass,
    },
    {
      num: 3,
      title: 'Design',
      description: 'Criação da experiência do usuário, identidade visual e protótipos das telas.',
      icon: Palette,
    },
    {
      num: 4,
      title: 'Desenvolvimento',
      description: 'Construção da solução, integrações, banco de dados e funcionalidades.',
      icon: Code,
    },
    {
      num: 5,
      title: 'Validação',
      description: 'Realização de testes, ajustes e melhorias.',
      icon: CheckCircle,
    },
    {
      num: 6,
      title: 'Entrega e evolução',
      description: 'Publicação da solução e possibilidade de manutenção e novas funcionalidades.',
      icon: Rocket,
    },
  ];

  return (
    <section
      id={SECTION_IDS.processo}
      aria-labelledby="processo-titulo"
      style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, #080B14 0%, #101524 100%)',
        position: 'relative',
      }}
    >
      <div className="container">
        <SectionHeading
          id="processo-titulo"
          eyebrow="Metodologia Ágil"
          accent="purple"
          title={
            <>
              Da ideia à <span className="text-gradient">solução digital</span>
            </>
          }
        />

        {/* 6 Steps Grid / Timeline */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            position: 'relative',
          }}
          className="process-grid"
        >
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-card"
                style={{
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  background: 'rgba(16, 21, 36, 0.85)',
                  position: 'relative',
                }}
              >
                {/* Triangular Decor badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(40, 215, 229, 0.1)',
                    border: '1px solid rgba(40, 215, 229, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: 'var(--accent-cyan)',
                  }}
                >
                  {step.num}
                </div>

                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(35, 136, 255, 0.15)',
                    border: '1px solid rgba(35, 136, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <StepIcon size={22} color="#2388FF" />
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F5F7FA' }}>{step.title}</h3>

                <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.55 }}>
                  {step.description}
                </p>

                {/* Decorative bottom corner triangle */}
                <div
                  className="triangle-decor triangle-purple"
                  style={{
                    bottom: '8px',
                    right: '8px',
                    transform: 'scale(0.6)',
                    opacity: 0.1,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
