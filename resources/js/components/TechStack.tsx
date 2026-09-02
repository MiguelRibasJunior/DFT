import React from 'react';
import { Cpu, Code, Database, Cloud, Terminal, Workflow, Server, Shield } from 'lucide-react';

export const TechStack: React.FC = () => {
  const row1 = [
    { name: 'React', icon: Code, color: '#28D7E5' },
    { name: 'React Native', icon: Code, color: '#2388FF' },
    { name: 'Node.js', icon: Server, color: '#28D7E5' },
    { name: 'TypeScript', icon: Terminal, color: '#2388FF' },
    { name: 'JavaScript', icon: Code, color: '#F7DF1E' },
    { name: 'Python', icon: Terminal, color: '#7B4DFF' },
    { name: 'n8n Automação', icon: Workflow, color: '#FF6D5A' },
  ];

  const row2 = [
    { name: 'Inteligência Artificial', icon: Cpu, color: '#7B4DFF' },
    { name: 'APIs REST & GraphQL', icon: Server, color: '#28D7E5' },
    { name: 'PostgreSQL', icon: Database, color: '#2388FF' },
    { name: 'MySQL', icon: Database, color: '#00758F' },
    { name: 'Docker', icon: Shield, color: '#2496ED' },
    { name: 'Serviços em Nuvem', icon: Cloud, color: '#28D7E5' },
    { name: 'OpenAI / Claude APIs', icon: Cpu, color: '#7B4DFF' },
  ];

  const renderItems = (items: typeof row1) =>
    [...items, ...items, ...items].map((tech, index) => {
      const Icon = tech.icon;
      return (
        <div
          key={`${tech.name}-${index}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 22px',
            borderRadius: '14px',
            background: 'rgba(16, 21, 36, 0.85)',
            border: '1px solid rgba(41, 50, 71, 0.8)',
            fontSize: '14px',
            fontWeight: 600,
            color: '#F5F7FA',
            whiteSpace: 'nowrap',
          }}
        >
          <Icon size={18} color={tech.color} />
          <span>{tech.name}</span>
        </div>
      );
    });

  return (
    <section
      id="tecnologias"
      style={{
        padding: '90px 0',
        background: 'linear-gradient(180deg, #101524 0%, #080B14 100%)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(41, 50, 71, 0.4)',
        borderBottom: '1px solid rgba(41, 50, 71, 0.4)',
      }}
    >
      <div className="container" style={{ marginBottom: '44px', textAlign: 'center' }}>
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
            marginBottom: '14px',
          }}
        >
          Tech Stack Moderna
        </div>

        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800 }}>
          Tecnologias que conectam nossas soluções
        </h2>
      </div>

      {/* Row 1 — Moving Left */}
      <div className="marquee-container" style={{ marginBottom: '20px' }}>
        <div className="marquee-track">{renderItems(row1)}</div>
      </div>

      {/* Row 2 — Moving Right */}
      <div className="marquee-container">
        <div className="marquee-track-reverse">{renderItems(row2)}</div>
      </div>
    </section>
  );
};
