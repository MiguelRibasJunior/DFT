import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { sectionHref, type NavItem } from '../../../config/sections';
import { handleAnchorClick } from '../../../utils/scroll';
import { ContactCTAButton } from '../../ui/ContactCTAButton';

interface MobileMenuProps {
  id: string;
  open: boolean;
  items: NavItem[];
  activeId: string | null;
  /** Fecha o menu; `returnFocus` devolve o foco ao botão que o abriu (Esc, clique fora). */
  onClose: (returnFocus?: boolean) => void;
  /** Botão hambúrguer: faz parte do "ciclo" de foco enquanto o menu está aberto. */
  toggleRef: React.RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menu de navegação para celular e tablet.
 *
 * Acessibilidade:
 * - fechado, fica `inert` + `visibility: hidden` (fora da ordem de tabulação e do leitor de tela);
 * - ao abrir, o foco vai para o primeiro link e fica preso entre o botão e os itens do menu;
 * - Esc ou clique fora fecham e devolvem o foco ao botão;
 * - a rolagem da página fica travada enquanto está aberto.
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({ id, open, items, activeId, onClose, toggleRef }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Trava a rolagem do fundo. useLayoutEffect garante que a trava sai no mesmo commit
  // em que o menu fecha, antes da rolagem suave até a seção escolhida começar.
  useLayoutEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose(true);
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusables = [
        toggleRef.current,
        ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((el): el is HTMLElement => el !== null);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !focusables.includes(current as HTMLElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !focusables.includes(current as HTMLElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, toggleRef]);

  const closeWithoutFocus = () => onClose(false);

  return (
    <>
      <div
        className={`mobile-menu__backdrop${open ? ' is-open' : ''}`}
        aria-hidden="true"
        onClick={() => onClose(true)}
      />

      <div
        id={id}
        ref={panelRef}
        className={`mobile-menu${open ? ' is-open' : ''}`}
        inert={!open}
      >
        <nav aria-label="Menu principal">
          <ul className="mobile-menu__list">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={sectionHref(item.id)}
                  className="mobile-menu__link"
                  aria-current={activeId === item.id ? 'location' : undefined}
                  onClick={(event) => handleAnchorClick(event, closeWithoutFocus)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-menu__actions">
          <ContactCTAButton fullWidth onNavigate={closeWithoutFocus} />
          <a href="/admin" className="btn btn-secondary mobile-menu__admin">
            <ShieldCheck size={18} color="#28D7E5" aria-hidden="true" />
            <span>Painel Admin</span>
          </a>
        </div>
      </div>
    </>
  );
};
