import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, ShieldCheck, X } from 'lucide-react';
import { NAV_ITEMS, SECTION_IDS, sectionHref } from '../../../config/sections';
import { useActiveSection } from '../../../hooks/useActiveSection';
import { useScrolled } from '../../../hooks/useScrolled';
import { handleAnchorClick } from '../../../utils/scroll';
import { ContactCTAButton } from '../../ui/ContactCTAButton';
import { Logo } from '../../ui/Logo';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';

/** Precisa bater com o breakpoint de `.site-header__nav` em resources/css/components/header.css. */
const DESKTOP_QUERY = '(min-width: 1200px)';
const MOBILE_MENU_ID = 'menu-mobile';
const NAV_IDS = NAV_ITEMS.map((item) => item.id);

/**
 * Header público: fixo no topo, muda de aparência ao rolar, destaca a seção atual
 * e troca a navegação por um menu hambúrguer em telas menores.
 */
export const Header: React.FC = () => {
  const scrolled = useScrolled(24);
  const activeId = useActiveSection(NAV_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback((returnFocus = false) => {
    setMenuOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Se a tela crescer até o layout de desktop com o menu aberto, fecha o menu.
  useEffect(() => {
    if (!menuOpen || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [menuOpen]);

  const classes = ['site-header', scrolled && 'site-header--scrolled', menuOpen && 'site-header--menu-open']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classes}>
      <div className="container site-header__inner">
        <a
          href={sectionHref(SECTION_IDS.hero)}
          className="site-header__brand"
          aria-label="Devs From Tomorrow — voltar ao início"
          onClick={(event) => handleAnchorClick(event, () => closeMenu())}
        >
          <Logo />
        </a>

        <DesktopNav items={NAV_ITEMS} activeId={activeId} />

        <div className="site-header__actions">
          <a
            href="/admin"
            className="btn btn-secondary site-header__admin"
            aria-label="Painel administrativo"
            title="Painel administrativo"
          >
            <ShieldCheck size={18} color="#28D7E5" aria-hidden="true" />
          </a>

          <ContactCTAButton size="sm" className="site-header__cta" />

          <button
            ref={toggleRef}
            type="button"
            className="site-header__toggle"
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={menuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <MobileMenu
        id={MOBILE_MENU_ID}
        open={menuOpen}
        items={NAV_ITEMS}
        activeId={activeId}
        onClose={closeMenu}
        toggleRef={toggleRef}
      />
    </header>
  );
};
