/**
 * Sistema Unificado de Motion para React
 * Devs From Tomorrow
 * 
 * Exporta componentes declarativos, tokens de animação e hooks de acessibilidade.
 */

export { motion } from './components';
export type { MotionProps, ViewportOptions } from './components';

export { useReducedMotion } from './useReducedMotion';
export type { ReducedMotionMode } from './useReducedMotion';

export { MotionConfig } from './MotionConfig';

export {
  VARIANTS,
  TRANSITIONS,
  getAccessibleVariant,
} from './variants';

export type {
  MotionVariants,
  MotionTransition,
  MotionStyleProperties,
} from './variants';
