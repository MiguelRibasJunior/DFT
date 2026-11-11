/**
 * Mapa único das seções da one page.
 *
 * Os IDs são um contrato público: aparecem no sitemap.xml, nos links do rodapé
 * cadastrados pelo admin (SiteSetting::DEFAULT_FOOTER_LINKS) e nos CTAs (#contato).
 * Não renomeie um ID sem atualizar esses lugares.
 */
export const SECTION_IDS = {
  hero: 'hero',
  solucoes: 'solucoes',
  automacao: 'automacao',
  diferenciais: 'diferenciais',
  processo: 'processo',
  projetos: 'portfolio',
  tecnologias: 'tecnologias',
  cta: 'comece-agora',
  contato: 'contato',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export interface NavItem {
  id: SectionId;
  label: string;
}

/** Itens exibidos no menu do header (desktop e mobile), na ordem em que aparecem na página. */
export const NAV_ITEMS: NavItem[] = [
  { id: SECTION_IDS.solucoes, label: 'Soluções' },
  { id: SECTION_IDS.automacao, label: 'Automação' },
  { id: SECTION_IDS.diferenciais, label: 'Diferenciais' },
  { id: SECTION_IDS.processo, label: 'Processo' },
  { id: SECTION_IDS.projetos, label: 'Projetos' },
  { id: SECTION_IDS.tecnologias, label: 'Tecnologias' },
  { id: SECTION_IDS.contato, label: 'Contato' },
];

export const sectionHref = (id: SectionId) => `#${id}`;
