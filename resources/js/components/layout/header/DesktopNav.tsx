import React from 'react';
import { sectionHref, type NavItem } from '../../../config/sections';
import { handleAnchorClick } from '../../../utils/scroll';

interface DesktopNavProps {
  items: NavItem[];
  activeId: string | null;
}

/** Navegação por âncoras exibida no header a partir do breakpoint de desktop. */
export const DesktopNav: React.FC<DesktopNavProps> = ({ items, activeId }) => (
  <nav className="site-header__nav" aria-label="Navegação principal">
    <ul className="site-header__nav-list">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={sectionHref(item.id)}
            className="site-header__nav-link"
            aria-current={activeId === item.id ? 'location' : undefined}
            onClick={(event) => handleAnchorClick(event)}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
