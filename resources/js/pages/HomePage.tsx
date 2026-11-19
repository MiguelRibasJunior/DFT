import React, { lazy, Suspense, useCallback, useState } from 'react';
import { SECTION_IDS } from '../config/sections';
import { usePublicContent } from '../hooks/usePublicContent';
import { scrollToSection } from '../utils/scroll';
import { OnePageLayout } from '../components/layout/OnePageLayout';
import { Hero } from '../components/sections/Hero';

// Seções abaixo da dobra: carregadas sob demanda (code-splitting) para acelerar FCP/LCP.
const Solutions = lazy(() => import('../components/sections/Solutions').then((m) => ({ default: m.Solutions })));
const Automation = lazy(() => import('../components/sections/Automation').then((m) => ({ default: m.Automation })));
const Differentials = lazy(() => import('../components/sections/Differentials').then((m) => ({ default: m.Differentials })));
const Process = lazy(() => import('../components/sections/Process').then((m) => ({ default: m.Process })));
const Portfolio = lazy(() => import('../components/sections/Portfolio').then((m) => ({ default: m.Portfolio })));
const TechStack = lazy(() => import('../components/sections/TechStack').then((m) => ({ default: m.TechStack })));
const CTASection = lazy(() => import('../components/sections/CTASection').then((m) => ({ default: m.CTASection })));
const ContactForm = lazy(() => import('../components/sections/ContactForm').then((m) => ({ default: m.ContactForm })));
const Footer = lazy(() => import('../components/layout/Footer').then((m) => ({ default: m.Footer })));
const ProjectModal = lazy(() => import('../components/modals/ProjectModal').then((m) => ({ default: m.ProjectModal })));

// Reserva a altura da seção enquanto ela carrega, para evitar layout shift (CLS).
// Usa o mesmo ID da seção real, então links como /#processo funcionam durante o carregamento.
const SectionPlaceholder: React.FC<{ minHeight: string; id?: string }> = ({ minHeight, id }) => (
  <div id={id} style={{ minHeight, width: '100%', pointerEvents: 'none' }} aria-hidden="true" />
);

const DEFAULT_SOLUTION = 'Automação com IA e n8n';

interface SelectedProject {
  title: string;
  description: string;
  technologies: string[];
}

/**
 * One page pública: composição das seções na ordem do protótipo,
 * com o conteúdo dinâmico vindo do painel admin.
 */
export const HomePage: React.FC = () => {
  const { projects, siteSettings, cta, contactLinks } = usePublicContent();
  const [selectedSolution, setSelectedSolution] = useState(DEFAULT_SOLUTION);
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);

  // Card de solução → pré-seleciona o serviço no formulário e leva até ele.
  const handleSelectSolution = useCallback((solutionName: string) => {
    setSelectedSolution(solutionName);
    scrollToSection(SECTION_IDS.contato);
  }, []);

  const handleSelectProject = useCallback((title: string, description: string, technologies: string[]) => {
    setSelectedProject({ title, description, technologies });
  }, []);

  return (
    <OnePageLayout
      logoUrl={siteSettings?.logo}
      siteName={siteSettings?.site_name}
      footer={
        <Suspense fallback={<SectionPlaceholder minHeight="380px" />}>
          <Footer settings={siteSettings} contactLinks={contactLinks} />
        </Suspense>
      }
      overlays={
        selectedProject && (
          <Suspense fallback={null}>
            <ProjectModal
              isOpen
              onClose={() => setSelectedProject(null)}
              title={selectedProject.title}
              description={selectedProject.description}
              technologies={selectedProject.technologies}
            />
          </Suspense>
        )
      }
    >
      {/* Hero: carregado de imediato para um LCP ótimo. */}
      <Hero />

      <Suspense fallback={<SectionPlaceholder minHeight="650px" id={SECTION_IDS.solucoes} />}>
        <Solutions onSelectSolution={handleSelectSolution} />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder minHeight="600px" id={SECTION_IDS.automacao} />}>
        <Automation />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder minHeight="500px" id={SECTION_IDS.diferenciais} />}>
        <Differentials />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder minHeight="550px" id={SECTION_IDS.processo} />}>
        <Process />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder minHeight="650px" id={SECTION_IDS.projetos} />}>
        <Portfolio onSelectProject={handleSelectProject} projects={projects} />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder minHeight="300px" id={SECTION_IDS.tecnologias} />}>
        <TechStack />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder minHeight="400px" id={SECTION_IDS.cta} />}>
        <CTASection cta={cta} />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder minHeight="750px" id={SECTION_IDS.contato} />}>
        <ContactForm initialSolution={selectedSolution} contactLinks={contactLinks} />
      </Suspense>
    </OnePageLayout>
  );
};
