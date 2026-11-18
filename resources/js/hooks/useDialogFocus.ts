import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Gerencia o foco de um modal (WAI-ARIA "dialog"):
 * - ao abrir, move o foco para dentro (primeiro controle focável);
 * - Tab e Shift+Tab ficam presos dentro do modal;
 * - Esc fecha;
 * - ao fechar, devolve o foco a quem o abriu (o card/botão) — a menos que a própria
 *   página já tenha levado o foco para outro lugar (ex.: "Solicitar orçamento" leva ao formulário).
 *
 * Use o ref retornado no elemento com `role="dialog"`. Funciona com modais que são
 * desmontados ao fechar e com os que ficam montados e alternam `isOpen`.
 */
export function useDialogFocus<T extends HTMLElement = HTMLDivElement>(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<T>(null);

  // `onClose` costuma ser uma função inline nova a cada render; guardá-la em ref evita
  // reexecutar o efeito (e roubar o foco de volta ao primeiro botão) a cada atualização.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Sem controle focável, o próprio diálogo recebe o foco para o leitor de tela anunciá-lo.
    const first = dialog.querySelector<HTMLElement>(FOCUSABLE);
    if (first) {
      first.focus();
    } else {
      dialog.tabIndex = -1;
      dialog.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const current = document.activeElement as HTMLElement | null;
      const inside = current !== null && dialog.contains(current);

      if (event.shiftKey && (!inside || current === firstEl)) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && (!inside || current === lastEl)) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);

      // Só devolve o foco se ele ainda estava no modal (ou se perdeu — foi parar no <body>
      // porque o botão focado sumiu). Se a página o moveu de propósito, respeita.
      const active = document.activeElement;
      const lostFocus = !active || active === document.body || dialog.contains(active);
      if (lostFocus && opener && opener.isConnected) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  return dialogRef;
}
