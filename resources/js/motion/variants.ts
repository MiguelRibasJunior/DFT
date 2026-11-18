/**
 * Padrão de Variantes e Transições Declarativas de Animação
 * Devs From Tomorrow — Motion Design Tokens
 */

export interface MotionTransition {
  duration?: number;
  delay?: number;
  ease?: string | number[] | readonly number[];
  type?: 'spring' | 'tween';
  stiffness?: number;
  damping?: number;
  staggerChildren?: number;
  delayChildren?: number;
}

export interface MotionStyleProperties {
  opacity?: number;
  x?: number | string;
  y?: number | string;
  scale?: number;
  rotate?: number;
  transition?: MotionTransition;
  [key: string]: any;
}

export interface MotionVariants {
  hidden?: MotionStyleProperties;
  visible?: MotionStyleProperties;
  hover?: MotionStyleProperties;
  tap?: MotionStyleProperties;
  exit?: MotionStyleProperties;
  [key: string]: MotionStyleProperties | undefined;
}

// Curvas de aceleração cinematográficas (Bezier)
export const TRANSITIONS = {
  smooth: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1], // easeOutExpo
  },
  spring: {
    type: 'spring',
    stiffness: 240,
    damping: 24,
  },
  bouncy: {
    type: 'spring',
    stiffness: 320,
    damping: 18,
  },
  snappy: {
    duration: 0.25,
    ease: [0.25, 1, 0.5, 1],
  },
  instant: {
    duration: 0.001,
  },
} as const;

/**
 * Variantes de animação padronizadas do projeto
 */
export const VARIANTS = {
  // Fade In simples
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },

  // Fade In com elevação suave para cima (ideal para títulos e seções)
  fadeInUp: {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  },

  // Fade In descendo (ideal para menus e navbars)
  fadeInDown: {
    hidden: { opacity: 0, y: -24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  },

  // Fade In com leve zoom de entrada
  fadeInScale: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  },

  // Deslizar a partir da esquerda
  slideInLeft: {
    hidden: { opacity: 0, x: -36 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  },

  // Deslizar a partir da direita
  slideInRight: {
    hidden: { opacity: 0, x: 36 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  },

  // Container com efeito de cascata (Stagger) para filhos
  staggerContainer: (staggerTime = 0.1, delayChildren = 0.1): MotionVariants => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerTime,
        delayChildren: delayChildren,
      },
    },
  }),

  // Micro-interação de hover em cards (elevação sutil)
  cardHover: {
    hover: {
      y: -6,
      scale: 1.015,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  },

  // Micro-interação tátil de clique em botões
  buttonTap: {
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 },
    },
  },
} as const;

/**
 * Normaliza e adapta variantes caso o usuário tenha redução de movimento ativa.
 * Remove deslocamentos de coordenadas X/Y e escalas agressivas, mantendo apenas fade de opacidade.
 */
export function getAccessibleVariant(
  variant: MotionVariants | undefined,
  shouldReduceMotion: boolean
): MotionVariants | undefined {
  if (!variant || !shouldReduceMotion) return variant;

  const sanitized: MotionVariants = {};

  for (const [key, state] of Object.entries(variant)) {
    if (!state) continue;
    sanitized[key] = {
      ...state,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        ...state.transition,
        duration: state.transition?.duration ? Math.min(state.transition.duration, 0.2) : 0.15,
      },
    };
  }

  return sanitized;
}
