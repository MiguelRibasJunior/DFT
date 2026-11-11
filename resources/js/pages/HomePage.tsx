import React, { useCallback, useState } from 'react';
import { SECTION_IDS } from '../config/sections';
import { usePublicContent } from '../hooks/usePublicContent';
import { scrollToSection } from '../utils/scroll';
import { Footer } from '../components/layout/Footer';
import { OnePageLayout } from '../components/layout/OnePageLayout';
import { ProjectModal } from '../components/modals/ProjectModal';
import { Automation } from '../components/sections/Automation';
import { ContactForm } from '../components/sections/ContactForm';
import { CTASection } from '../components/sections/CTASection';
import { Differentials } from '../components/sections/Differentials';
import { Hero } from '../components/sections/Hero';
import { Portfolio } from '../components/sections/Portfolio';
import { Process } from '../components/sections/Process';
import { Solutions } from '../components/sections/Solutions';
import { TechStack } from '../components/sections/TechStack';

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
      footer={<Footer settings={siteSettings} contactLinks={contactLinks} />}
      overlays={
        <ProjectModal
          isOpen={selectedProject !== null}
          onClose={() => setSelectedProject(null)}
          title={selectedProject?.title ?? ''}
          description={selectedProject?.description ?? ''}
          technologies={selectedProject?.technologies ?? []}
        />
      }
    >
      <Hero />
      <Solutions onSelectSolution={handleSelectSolution} />
      <Automation />
      <Differentials />
      <Process />
      <Portfolio onSelectProject={handleSelectProject} projects={projects} />
      <TechStack />
      <CTASection cta={cta} />
      <ContactForm initialSolution={selectedSolution} contactLinks={contactLinks} />
    </OnePageLayout>
  );
};
