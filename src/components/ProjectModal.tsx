import React from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  technologies: string[];
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  technologies,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(4, 6, 11, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '36px',
          background: 'rgba(16, 21, 36, 0.95)',
          borderColor: 'rgba(40, 215, 229, 0.4)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-gray)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={22} color="#F5F7FA" />
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '16px',
            background: 'rgba(40, 215, 229, 0.1)',
            border: '1px solid rgba(40, 215, 229, 0.3)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--accent-cyan)',
            marginBottom: '16px',
          }}
        >
          <Sparkles size={14} />
          <span>Case de Sucesso</span>
        </div>

        <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '14px', color: '#F5F7FA' }}>
          {title}
        </h3>

        <p style={{ fontSize: '15px', color: 'var(--text-gray)', lineHeight: 1.6, marginBottom: '24px' }}>
          {description}
        </p>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#F5F7FA', marginBottom: '10px' }}>
            Tecnologias & Arquitetura Utilizada:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {technologies.map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(35, 136, 255, 0.15)',
                  border: '1px solid rgba(35, 136, 255, 0.4)',
                  color: 'var(--accent-cyan)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: '14px' }}>
            Fechar
          </button>
          <a
            href="#contato"
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            <span>Quero um projeto similar</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
