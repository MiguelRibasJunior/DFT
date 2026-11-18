import { useState, useEffect, createContext, useContext } from 'react';

export type ReducedMotionMode = 'user' | 'always' | 'never';

export const MotionConfigContext = createContext<{
  reducedMotion: ReducedMotionMode;
}>({
  reducedMotion: 'user',
});

/**
 * Hook para detectar e respeitar a preferência de redução de movimento do sistema operacional.
 * Atende às diretrizes WCAG 2.1 (Acessibilidade) para usuários com sensibilidade vestibular.
 */
export function useReducedMotion(): boolean {
  const { reducedMotion } = useContext(MotionConfigContext);

  const [systemReducedMotion, setSystemReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  if (reducedMotion === 'always') return true;
  if (reducedMotion === 'never') return false;
  return systemReducedMotion;
}
