import type { MouseEvent } from 'react';

/**
 * Utilitários de rolagem suave entre seções.
 *
 * O deslocamento do header fixo é resolvido no CSS (`scroll-padding-top` no <html>),
 * então tanto links âncora nativos quanto `scrollIntoView` param a seção logo abaixo
 * do header, sem ficar escondida atrás dele.
 */

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Extrai o ID de um href de âncora interna ("#contato" → "contato"); null para qualquer outra URL. */
export const anchorIdFromHref = (href: string): string | null => {
  if (!href.startsWith('#') || href.length < 2) return null;
  try {
    return decodeURIComponent(href.slice(1));
  } catch {
    return null;
  }
};

interface ScrollToSectionOptions {
  /** Atualiza o hash da URL sem criar entrada nova no histórico. Padrão: true. */
  updateHash?: boolean;
  /** Move o foco para a seção (leitores de tela e navegação por teclado). Padrão: true. */
  moveFocus?: boolean;
}

/**
 * Rola suavemente até a seção com o ID informado.
 * Retorna false se a seção não existir na página (o chamador pode deixar o link seguir o padrão).
 */
export function scrollToSection(id: string, { updateHash = true, moveFocus = true }: ScrollToSectionOptions = {}): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });

  if (updateHash && window.location.hash !== `#${id}`) {
    window.history.replaceState(null, '', `#${id}`);
  }

  if (moveFocus) {
    // Seções não são focáveis por padrão: tabindex=-1 permite o foco programático
    // sem colocá-las na ordem de tabulação. preventScroll evita "pular" a animação.
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  return true;
}

/**
 * Handler de clique reutilizável para links âncora: intercepta "#id", faz a rolagem
 * suave e deixa o comportamento padrão do navegador para links externos, seções
 * inexistentes ou ctrl/cmd+clique (abrir em nova aba).
 *
 * `onNavigate` roda antes da rolagem (ex.: fechar o menu mobile e liberar o scroll da
 * página); a rolagem começa no frame seguinte, já com o layout atualizado.
 */
export function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>, onNavigate?: () => void): void {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const id = anchorIdFromHref(event.currentTarget.getAttribute('href') ?? '');
  if (!id || !document.getElementById(id)) return;

  event.preventDefault();
  onNavigate?.();
  window.requestAnimationFrame(() => scrollToSection(id));
}
