import React, { useId } from 'react';

interface LogoProps {
  /** Tamanho do símbolo em pixels. */
  size?: number;
  /** Exibe a linha "Digital Solutions & AI" abaixo do nome. */
  showTagline?: boolean;
  className?: string;
}

/**
 * Logo da Devs From Tomorrow (símbolo de triângulos conectados + nome).
 * É apenas visual: quem usa decide se envolve em link. Os IDs dos gradientes
 * são gerados por instância para o logo poder aparecer no header e no rodapé ao mesmo tempo.
 */
export const Logo: React.FC<LogoProps> = ({ size = 36, showTagline = true, className }) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const outlineId = `logo-outline-${uid}`;
  const fillId = `logo-fill-${uid}`;

  return (
    <span className={['dft-logo', className].filter(Boolean).join(' ')}>
      <svg
        className="dft-logo__mark"
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <polygon points="20,4 6,34 34,34" stroke={`url(#${outlineId})`} strokeWidth="2.5" fill="none" />
        <polygon points="20,12 12,28 28,28" fill={`url(#${fillId})`} opacity="0.8" />
        <circle cx="20" cy="4" r="2.5" fill="#28D7E5" />
        <circle cx="6" cy="34" r="2.5" fill="#2388FF" />
        <circle cx="34" cy="34" r="2.5" fill="#7B4DFF" />
        <line x1="20" y1="4" x2="20" y2="28" stroke="#28D7E5" strokeWidth="1" strokeDasharray="2 2" />
        <defs>
          <linearGradient id={outlineId} x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="#28D7E5" />
            <stop offset="50%" stopColor="#2388FF" />
            <stop offset="100%" stopColor="#7B4DFF" />
          </linearGradient>
          <linearGradient id={fillId} x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="#7B4DFF" />
            <stop offset="100%" stopColor="#28D7E5" />
          </linearGradient>
        </defs>
      </svg>

      <span className="dft-logo__text">
        <span className="dft-logo__name">
          Devs From <span className="text-cyan">Tomorrow</span>
        </span>
        {showTagline && <span className="dft-logo__tagline">Digital Solutions &amp; AI</span>}
      </span>
    </span>
  );
};
