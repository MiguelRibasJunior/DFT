import React from 'react';
import { MotionConfigContext, type ReducedMotionMode } from './useReducedMotion';

interface MotionConfigProps {
  children: React.ReactNode;
  reducedMotion?: ReducedMotionMode;
}

/**
 * Provider global de configuração para o sistema de animações declarativas Motion.
 * Permite alternar o comportamento de acessibilidade e redução de movimento.
 */
export const MotionConfig: React.FC<MotionConfigProps> = ({
  children,
  reducedMotion = 'user',
}) => {
  return (
    <MotionConfigContext.Provider value={{ reducedMotion }}>
      {children}
    </MotionConfigContext.Provider>
  );
};
