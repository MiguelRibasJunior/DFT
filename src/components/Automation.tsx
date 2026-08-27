import React from 'react';
import { Cpu, ArrowRight, Zap, Database, Bot, Workflow, MessageCircle, FileText, Bell, Layers } from 'lucide-react';

interface AutomationProps {
  onAutomateClick: () => void;
}

export const Automation: React.FC<AutomationProps> = ({ onAutomateClick }) => {
  const steps = [
    { label: 'Entrada de Dados', icon: Database, color: '#2388FF' },
    { label: 'Automação n8n', icon: Workflow, color: '#28D7E5' },
    { label: 'Inteligência Artificial', icon: Bot, color: '#7B4DFF' },
    { label: 'Sistema Interno', icon: Layers, color: '#2388FF' },
    { label: 'Resultado Rápido', icon: Zap, color: '#28D7E5' },
  ];

  const examples = [
    { title: 'Atendimento automático', icon: MessageCircle },
    { title: 'Geração de relatórios', icon: FileText },
    { title: 'Integração com WhatsApp', icon: MessageCircle },
    { title: 'Processamento de documentos', icon: FileText },
    { title: 'Envio de notificações', icon: Bell },
    { title: 'Organização de dados', icon: Database },
    { title: 'Assistentes virtuais', icon: Bot },
    { title: 'Integração com CRM e ERP', icon: Layers },
  ];

  return (
    <section
      id="automacao"
      style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, #080B14 0%, #101524 50%, #080B14 100%)',
        position: 'relative',
        borderTop: '1px solid rgba(41, 50, 71, 0.5)',
        borderBottom: '1px solid rgba(41, 50, 71, 0.5)',
      }}
    >
      {/* Glow Center Accent */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(123, 77, 255, 0.12) 0%, rgba(8, 11, 20, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'rgba(123, 77, 255, 0.12)',
              border: '1px solid rgba(123, 77, 255, 0.35)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent-purple)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
            }}
          >
            <Cpu size={14} color="#7B4DFF" />
            <span>Ecossistema n8n & IA</span>
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: '16px' }}>
            Automatize processos e ganhe eficiência
          </h2>

          <p style={{ fontSize: '16px', color: 'var(--text-gray)', lineHeight: 1.6 }}>
            Conectamos sistemas, ferramentas e inteligências artificiais para reduzir atividades repetitivas, organizar informações e acelerar processos.
          </p>
        </div>

        {/* Visual Flow Diagram */}
        <div
          className="glass-card"
          style={{
            padding: '36px 24px',
            marginBottom: '48px',
            borderColor: 'rgba(40, 215, 229, 0.3)',
            background: 'rgba(16, 21, 36, 0.9)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--accent-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '24px',
            }}
          >
            Fluxo de Automação Inteligente
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
            className="flow-container"
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.label}>
                  <div
                    style={{
                      flex: '1 1 150px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '16px 12px',
                      borderRadius: '12px',
                      background: 'rgba(8, 11, 20, 0.8)',
                      border: '1px solid rgba(41, 50, 71, 0.8)',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                    }}
                    className="flow-node"
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: `rgba(${
                          step.color === '#7B4DFF' ? '123, 77, 255' : step.color === '#28D7E5' ? '40, 215, 229' : '35, 136, 255'
                        }, 0.15)`,
                        border: `1px solid ${step.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <Icon size={20} color={step.color} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#F5F7FA' }}>{step.label}</span>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="flow-arrow" style={{ color: 'var(--accent-cyan)', opacity: 0.6 }}>
                      <ArrowRight size={22} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 8 Example Pills Grid */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, textAlign: 'center', marginBottom: '24px', color: 'var(--text-gray)' }}>
            Exemplos de automações que desenvolvemos:
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {examples.map((item) => {
              const ExIcon = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: 'rgba(16, 21, 36, 0.65)',
                    border: '1px solid rgba(41, 50, 71, 0.6)',
                    transition: 'all 0.25s ease',
                  }}
                  className="example-pill"
                >
                  <ExIcon size={18} color="#28D7E5" />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#F5F7FA' }}>{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Button */}
        <div style={{ textAlign: 'center' }}>
          <a href="#contato" onClick={onAutomateClick} className="btn btn-primary btn-glow">
            <Zap size={18} />
            <span>Quero automatizar um processo</span>
          </a>
        </div>
      </div>

      <style>{`
        .example-pill:hover {
          border-color: rgba(40, 215, 229, 0.5);
          background: rgba(22, 30, 52, 0.9);
          transform: translateY(-2px);
        }
        .flow-node:hover {
          border-color: #28D7E5;
          box-shadow: 0 0 15px rgba(40, 215, 229, 0.2);
        }
        @media (max-width: 768px) {
          .flow-arrow {
            transform: rotate(90deg);
            margin: 4px 0;
          }
          .flow-container {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
};
