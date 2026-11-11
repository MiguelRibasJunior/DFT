import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SECTION_IDS, sectionHref } from '../../config/sections';
import { handleAnchorClick } from '../../utils/scroll';

interface ContactCTAButtonProps {
  label?: string;
  /** Chamado depois da navegação (ex.: fechar o menu mobile). */
  onNavigate?: () => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

/**
 * Chamada para ação que leva ao formulário de contato.
 * É um link âncora de verdade (funciona sem JS, abre em nova aba com ctrl+clique)
 * com rolagem suave quando o JS está ativo.
 */
export const ContactCTAButton: React.FC<ContactCTAButtonProps> = ({
  label = 'Solicitar orçamento',
  onNavigate,
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const classes = ['btn', 'btn-primary', 'contact-cta', `contact-cta--${size}`, fullWidth && 'contact-cta--block', className]
    .filter(Boolean)
    .join(' ');

  return (
    <a href={sectionHref(SECTION_IDS.contato)} className={classes} onClick={(event) => handleAnchorClick(event, onNavigate)}>
      <span>{label}</span>
      <ArrowRight size={16} aria-hidden="true" />
    </a>
  );
};
