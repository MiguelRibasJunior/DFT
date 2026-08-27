import React from 'react';
import { ExternalLink, Layers, Bot, Smartphone, ArrowRight } from 'lucide-react';

interface PortfolioProps {
  onSelectProject: (title: string, desc: string, tags: string[]) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectProject }) => {
  const projects = [
    {
      id: 1,
      title: 'Plataforma de Gestão',
      category: 'Sistema Web & Dashboard',
      description: 'Sistema online para gerenciamento de processos, usuários, documentos e indicadores.',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      gradient: 'linear-gradient(135deg, rgba(35, 136, 255, 0.25) 0%, rgba(123, 77, 255, 0.15) 100%)',
      borderColor: 'rgba(35, 136, 255, 0.4)',
      icon: Layers,
    },
    {
      id: 2,
      title: 'Assistente Virtual com IA',
      category: 'Chatbot & Automação n8n',
      description: 'Chatbot inteligente integrado a dados e ferramentas de automação.',
      technologies: ['Python', 'n8n', 'OpenAI', 'WhatsApp API'],
      gradient: 'linear-gradient(135deg, rgba(40, 215, 229, 0.25) 0%, rgba(35, 136, 255, 0.15) 100%)',
      borderColor: 'rgba(40, 215, 229, 0.4)',
      icon: Bot,
    },
    {
      id: 3,
      title: 'Aplicativo Personalizado',
      category: 'Mobile iOS & Android',
      description: 'Aplicativo desenvolvido para facilitar serviços, comunicação e acesso a informações.',
      technologies: ['React Native', 'TypeScript', 'Node.js', 'Docker'],
      gradient: 'linear-gradient(135deg, rgba(123, 77, 255, 0.25) 0%, rgba(40, 215, 229, 0.15) 100%)',
      borderColor: 'rgba(123, 77, 255, 0.4)',
      icon: Smartphone,
    },
  ];

  return (
    <section id="projetos" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="container">
        {/* Header */}
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
            Cases em Destaque
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800 }}>
            Tecnologia aplicada a <span className="text-gradient">resultados reais</span>
          </h2>
        </div>

        {/* 3 Project Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
          }}
        >
          {projects.map((project) => {
            const ProjIcon = project.icon;
            return (
              <div
                key={project.id}
                className="glass-card project-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(16, 21, 36, 0.85)',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                }}
              >
                {/* Visual Preview Banner */}
                <div
                  style={{
                    height: '210px',
                    background: project.gradient,
                    borderBottom: '1px solid rgba(41, 50, 71, 0.6)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                >
                  {/* Decorative Mock Interface Graphics */}
                  <div
                    style={{
                      width: '85%',
                      height: '85%',
                      background: 'rgba(8, 11, 20, 0.75)',
                      borderRadius: '10px',
                      border: `1px solid ${project.borderColor}`,
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5F56' }} />
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFBD2E' }} />
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27C93F' }} />
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-gray)' }}>Devs Tomorrow v2.4</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                      <ProjIcon size={24} color="#28D7E5" />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: '8px', width: '60%', background: 'rgba(40, 215, 229, 0.4)', borderRadius: '4px' }} />
                        <div style={{ height: '6px', width: '35%', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', marginTop: '4px' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                      <div style={{ height: '28px', background: 'rgba(35, 136, 255, 0.15)', borderRadius: '6px', border: '1px stroke #2388FF' }} />
                      <div style={{ height: '28px', background: 'rgba(123, 77, 255, 0.15)', borderRadius: '6px' }} />
                    </div>
                  </div>

                  {/* Hover Overlay Button */}
                  <div className="project-overlay">
                    <button
                      onClick={() => onSelectProject(project.title, project.description, project.technologies)}
                      className="btn btn-primary"
                      style={{ padding: '10px 20px', fontSize: '14px' }}
                    >
                      <span>Ver detalhes do projeto</span>
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--accent-cyan)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      {project.category}
                    </span>

                    <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#F5F7FA' }}>
                      {project.title}
                    </h3>

                    <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.5, marginBottom: '20px' }}>
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: 'rgba(41, 50, 71, 0.6)',
                            color: '#F5F7FA',
                            border: '1px solid rgba(41, 50, 71, 0.9)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onSelectProject(project.title, project.description, project.technologies)}
                      className="btn btn-secondary"
                      style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                    >
                      <span>Ver projeto</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .project-card .project-overlay {
          position: absolute;
          inset: 0;
          background: rgba(8, 11, 20, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .project-card:hover .project-overlay {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};
