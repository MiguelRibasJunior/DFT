import React, { useEffect } from 'react';
import { X, CheckCircle2, Sparkles } from 'lucide-react';

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'rgba(12, 17, 31, 0.96)',
          border: '1px solid rgba(40, 215, 229, 0.3)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(40, 215, 229, 0.15)',
          position: 'relative',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar detalhes do projeto"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-gray)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(40, 215, 229, 0.15)', border: '1px solid rgba(40, 215, 229, 0.3)', fontSize: '11px', fontWeight: 700, color: '#28D7E5', textTransform: 'uppercase', marginBottom: '12px' }}>
            <Sparkles size={12} />
            <span>Devs From Tomorrow Case</span>
          </div>
          <h3 id="project-modal-title" style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            {title}
          </h3>
        </div>

        {/* Modal Body */}
        <div style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.7, marginBottom: '24px' }}>
          {description}
        </div>

        {/* Tech Stack Chips */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#F5F7FA', marginBottom: '10px' }}>
            Tecnologias & Arquitetura Utilizadas:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {technologies.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(35, 136, 255, 0.12)',
                  border: '1px solid rgba(35, 136, 255, 0.25)',
                  fontSize: '12px',
                  color: '#28D7E5',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={13} color="#28D7E5" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
