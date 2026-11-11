import { lazy, Suspense, useEffect, useState } from 'react';
import { GeometricCanvas } from './components/GeometricCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { getContactLinks, getCta, getProjects, getSiteSettings, type PublicContactLink, type PublicCta, type PublicProject, type PublicSiteSettings } from './services/contentService';

// Below-the-fold components: code-split & lazy loaded to maximize initial loading speed (FCP & LCP)
const Solutions = lazy(() => import('./components/Solutions').then((m) => ({ default: m.Solutions })));
const Automation = lazy(() => import('./components/Automation').then((m) => ({ default: m.Automation })));
const Differentials = lazy(() => import('./components/Differentials').then((m) => ({ default: m.Differentials })));
const Process = lazy(() => import('./components/Process').then((m) => ({ default: m.Process })));
const Portfolio = lazy(() => import('./components/Portfolio').then((m) => ({ default: m.Portfolio })));
const TechStack = lazy(() => import('./components/TechStack').then((m) => ({ default: m.TechStack })));
const CTASection = lazy(() => import('./components/CTASection').then((m) => ({ default: m.CTASection })));
const ContactForm = lazy(() => import('./components/ContactForm').then((m) => ({ default: m.ContactForm })));
const Footer = lazy(() => import('./components/Footer').then((m) => ({ default: m.Footer })));
const ProjectModal = lazy(() => import('./components/ProjectModal').then((m) => ({ default: m.ProjectModal })));

// Layout reservation placeholders to prevent Cumulative Layout Shift (CLS)
const SectionPlaceholder: React.FC<{ minHeight: string; id?: string }> = ({ minHeight, id }) => (
  <div id={id} style={{ minHeight, width: '100%', pointerEvents: 'none' }} aria-hidden="true" />
);

export function App() {
  const [selectedSolution, setSelectedSolution] = useState<string>('Automação com IA e n8n');
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [cta, setCta] = useState<PublicCta | null>(null);
  const [contactLinks, setContactLinks] = useState<PublicContactLink[] | null | undefined>(undefined);

  useEffect(() => {
    getProjects().then(setProjects);
    getSiteSettings().then(setSiteSettings);
    getCta('cta_section').then(setCta);
    getContactLinks().then(setContactLinks);
  }, []);

  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    technologies: string[];
  }>({
    isOpen: false,
    title: '',
    description: '',
    technologies: [],
  });

  const handleOpenQuote = () => {
    const contactElem = document.getElementById('contato');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSolution = (solutionName: string) => {
    setSelectedSolution(solutionName);
    const contactElem = document.getElementById('contato');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProject = (title: string, description: string, technologies: string[]) => {
    setModalData({
      isOpen: true,
      title,
      description,
      technologies,
    });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Background Interactive Canvas */}
      <GeometricCanvas />

      {/* Main Header / Navbar (Eager) */}
      <Navbar onOpenQuote={handleOpenQuote} />

      {/* Main Content Assembly */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section: Eager loaded to ensure optimal LCP (Largest Contentful Paint) */}
        <Hero onOpenQuote={handleOpenQuote} />

        {/* Below-the-fold sections: Lazy loaded with CLS-safe height placeholders */}
        <Suspense fallback={<SectionPlaceholder minHeight="650px" id="solucoes" />}>
          <Solutions onSelectSolution={handleSelectSolution} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder minHeight="600px" id="automacao" />}>
          <Automation onAutomateClick={handleOpenQuote} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder minHeight="500px" id="diferenciais" />}>
          <Differentials />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder minHeight="550px" id="processo" />}>
          <Process />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder minHeight="650px" id="cases" />}>
          <Portfolio onSelectProject={handleSelectProject} projects={projects} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder minHeight="300px" id="tecnologias" />}>
          <TechStack />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder minHeight="400px" />}>
          <CTASection onStartProject={handleOpenQuote} cta={cta} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder minHeight="750px" id="contato" />}>
          <ContactForm initialSolution={selectedSolution} contactLinks={contactLinks} />
        </Suspense>
      </main>

      {/* Footer */}
      <Suspense fallback={<SectionPlaceholder minHeight="380px" />}>
        <Footer settings={siteSettings} contactLinks={contactLinks} />
      </Suspense>

      {/* Detail Modal: Lazy rendered only when opened */}
      {modalData.isOpen && (
        <Suspense fallback={null}>
          <ProjectModal
            isOpen={modalData.isOpen}
            onClose={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
            title={modalData.title}
            description={modalData.description}
            technologies={modalData.technologies}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
