import { useEffect, useState } from 'react';

/**
 * Indica se a página já foi rolada além de `threshold` pixels.
 * Usa listener passivo + requestAnimationFrame para não pesar durante a rolagem
 * e já considera a posição atual ao montar (ex.: recarregar a página no meio).
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > threshold);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
