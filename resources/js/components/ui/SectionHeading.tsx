import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type Accent = 'cyan' | 'blue' | 'purple';

interface SectionHeadingProps {
  /** ID do <h2>; use no `aria-labelledby` da <section> para nomear a região. */
  id?: string;
  /** Texto curto da pílula acima do título (ex.: "Fale Conosco"). */
  eyebrow: string;
  eyebrowIcon?: LucideIcon;
  accent?: Accent;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /**
   * Controle da animação de entrada. `undefined` = sem animação (aparece direto);
   * boolean = participa do reveal da seção (normalmente o `isVisible` do useIntersectionObserver).
   */
  revealed?: boolean;
  className?: string;
}

/** Cabeçalho padrão das seções: pílula de destaque + título (h2) + subtítulo opcional. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  accent = 'cyan',
  title,
  subtitle,
  revealed,
  className,
}) => {
  const classes = [
    'section-heading',
    revealed !== undefined && 'reveal-item',
    revealed && 'reveal-visible',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <span className={`section-eyebrow section-eyebrow--${accent}`}>
        {EyebrowIcon && <EyebrowIcon size={14} aria-hidden="true" />}
        <span>{eyebrow}</span>
      </span>
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};
