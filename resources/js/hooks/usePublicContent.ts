import { useEffect, useState } from 'react';
import {
  getContactLinks,
  getCta,
  getProjects,
  getSiteSettings,
  type PublicContactLink,
  type PublicCta,
  type PublicProject,
  type PublicSiteSettings,
} from '../services/contentService';

export interface PublicContent {
  projects: PublicProject[];
  siteSettings: PublicSiteSettings | null;
  cta: PublicCta | null;
  /** undefined = carregando, null = falha na API (componentes usam os canais padrão), lista = canais ativos do admin. */
  contactLinks: PublicContactLink[] | null | undefined;
}

/** Carrega, em paralelo, o conteúdo dinâmico da one page cadastrado no painel admin. */
export function usePublicContent(): PublicContent {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [cta, setCta] = useState<PublicCta | null>(null);
  const [contactLinks, setContactLinks] = useState<PublicContactLink[] | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    const ifActive = <T,>(setter: (value: T) => void) => (value: T) => {
      if (active) setter(value);
    };

    getProjects().then(ifActive(setProjects));
    getSiteSettings().then(ifActive(setSiteSettings));
    getCta('cta_section').then(ifActive(setCta));
    getContactLinks().then(ifActive(setContactLinks));

    return () => {
      active = false;
    };
  }, []);

  return { projects, siteSettings, cta, contactLinks };
}
