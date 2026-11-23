import { useEffect, useState } from 'react';

/**
 * "Scroll spy": devolve o ID da seção que está cruzando a faixa central da tela,
 * para destacar o item correspondente no menu. Seções que não existem no DOM são ignoradas.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = ids.join('|');

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const elements = idsKey
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Em caso de empate, vence a seção que aparece primeiro na página.
        const current = elements.find((el) => visible.has(el.id));
        setActiveId(current ? current.id : null);
      },
      // Faixa fina no meio da viewport: só uma seção a cruza por vez.
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
}
