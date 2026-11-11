import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | null;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content }) => {
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
      aria-labelledby="legal-modal-title"
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
          maxWidth: '680px',
          maxHeight: '80vh',
          background: 'rgba(12, 17, 31, 0.96)',
          border: '1px solid rgba(40, 215, 229, 0.3)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(40, 215, 229, 0.15)',
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

        {/* Modal Header */}
        <h3
          id="legal-modal-title"
          style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: '0 40px 20px 0', flexShrink: 0 }}
        >
          {title}
        </h3>

        {/* Modal Body */}
        <div
          className="legal-modal-content"
          style={{
            fontSize: '14px',
            color: 'var(--text-gray)',
            lineHeight: 1.75,
            overflowY: 'auto',
            paddingRight: '8px',
          }}
        >
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p style={{ fontStyle: 'italic' }}>Este conteúdo ainda não foi cadastrado.</p>
          )}
        </div>

        <style>{`
          .legal-modal-content h1,
          .legal-modal-content h2,
          .legal-modal-content h3 {
            color: #F5F7FA;
            margin: 20px 0 8px;
            line-height: 1.3;
          }
          .legal-modal-content h1 { font-size: 20px; }
          .legal-modal-content h2 { font-size: 17px; }
          .legal-modal-content h3 { font-size: 15px; }
          .legal-modal-content p { margin: 0 0 12px; }
          .legal-modal-content ul,
          .legal-modal-content ol { margin: 0 0 12px 20px; }
          .legal-modal-content li { margin-bottom: 6px; }
          .legal-modal-content a { color: #28D7E5; }
          .legal-modal-content strong { color: #F5F7FA; }
        `}</style>
      </div>
    </div>
  );
};
