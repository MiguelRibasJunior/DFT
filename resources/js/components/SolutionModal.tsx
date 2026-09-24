import React, { useEffect } from 'react';
import { X, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: () => void;
  icon: LucideIcon;
  color: string;
  badge: string;
  title: string;
  longDescription: string;
  highlights: string[];
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  isOpen,
  onClose,
  onRequestQuote,
  icon: Icon,
  color,
  badge,
  title,
  longDescription,
  highlights,
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
      aria-labelledby="solution-modal-title"
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
          maxWidth: '560px',
          maxHeight: '85vh',
          background: 'rgba(12, 17, 31, 0.96)',
          border: `1px solid ${color}55`,
          borderRadius: '20px',
          padding: '32px',
          boxShadow: `0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px ${color}26`,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
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
            flexShrink: 0,
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px', paddingRight: '40px', flexShrink: 0 }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: `${color}1F`,
              border: `1px solid ${color}4D`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={26} color={color} />
          </div>
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '12px',
                background: 'rgba(41, 50, 71, 0.5)',
                color: 'var(--text-gray)',
                border: '1px solid rgba(41, 50, 71, 0.8)',
                display: 'inline-block',
                marginBottom: '8px',
              }}
            >
              {badge}
            </span>
            <h3 id="solution-modal-title" style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {title}
            </h3>
          </div>
        </div>

        {/* Body (scrollable) */}
        <div style={{ overflowY: 'auto', paddingRight: '4px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.7, marginBottom: '20px' }}>
            {longDescription}
          </p>

          <div style={{ fontSize: '12px', fontWeight: 600, color: '#F5F7FA', marginBottom: '10px' }}>
            O que está incluso:
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {highlights.map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-gray)', lineHeight: 1.5 }}>
                <CheckCircle2 size={15} color={color} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexShrink: 0 }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
            Fechar
          </button>
          <button onClick={onRequestQuote} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
            <span>Solicitar orçamento</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
