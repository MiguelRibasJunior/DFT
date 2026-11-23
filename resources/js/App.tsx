import { useEffect, useState } from 'react';
import {
  GeometricCanvas,
  Navbar,
  Hero,
  Solutions,
  Automation,
  Differentials,
  Process,
  Portfolio,
  TechStack,
  CTASection,
  ContactForm,
  Footer,
  ProjectModal,
  AdminLoginModal,
  AdminPanel,
} from '@/components';
import { MotionConfig } from '@/motion';
import { getCta, getProjects, getSiteSettings } from '@/services/contentService';
import { isAuthenticated } from '@/services/authService';
import type { AdminUser, PublicCta, PublicProject, PublicSiteSettings } from '@/types';

interface AppProps {
  initialData?: {
    settings: PublicSiteSettings | null;
    projects: PublicProject[];
    cta: PublicCta | null;
  };
}

const EMPTY_INITIAL_DATA = {
  settings: null,
  projects: [],
  cta: null,
};

export function App({
  initialData = EMPTY_INITIAL_DATA,
}: AppProps) {
  const safeData = initialData || EMPTY_INITIAL_DATA;
  const [selectedSolution, setSelectedSolution] = useState<string>('Automação com IA e n8n');
  const [projects, setProjects] = useState<PublicProject[]>(
    safeData.projects || []
  );

  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(
    safeData.settings || null
  );

  const [cta, setCta] = useState<PublicCta | null>(
    safeData.cta || null
  );

  // Admin Auth & Panel States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => isAuthenticated());
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


  const reloadData = (useInitialData = false) => {
    getProjects(useInitialData ? initialData.projects : undefined)
      .then(setProjects);

    getSiteSettings(useInitialData ? initialData.settings : undefined)
      .then(setSiteSettings);

    getCta(
      'cta_section',
      useInitialData ? initialData.cta : undefined
    ).then(setCta);
  };


  useEffect(() => {
    reloadData(true);

    // Permite abrir o painel diretamente via #admin ou rota /admin
    const checkAdminRoute = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        if (isAuthenticated()) {
          setIsAdminPanelOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
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

  const handleOpenAdmin = () => {
    if (isAuthenticated()) {
      setIsAdminPanelOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (_user: AdminUser) => {
    setIsLoggedIn(true);
    setIsAdminPanelOpen(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminPanelOpen(false);
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
    <MotionConfig reducedMotion="user">
      <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        {/* Background Interactive Canvas */}
        <GeometricCanvas />

        {/* Main Header / Navbar */}
        <Navbar
          onOpenQuote={handleOpenQuote}
          onOpenAdmin={handleOpenAdmin}
          isLoggedIn={isLoggedIn}
        />

        {/* Main Content Assembly */}
        <main style={{ position: 'relative', zIndex: 1 }}>
          <Hero onOpenQuote={handleOpenQuote} />
          <Solutions onSelectSolution={handleSelectSolution} />
          <Automation onAutomateClick={handleOpenQuote} />
          <Differentials />
          <Process />
          <Portfolio onSelectProject={handleSelectProject} projects={projects} />
          <TechStack />
          <CTASection onStartProject={handleOpenQuote} cta={cta} />
          <ContactForm initialSolution={selectedSolution} settings={siteSettings} />
        </main>

        {/* Footer */}
        <Footer settings={siteSettings} onOpenAdmin={handleOpenAdmin} />

        {/* Detail Modal */}
        <ProjectModal
          isOpen={modalData.isOpen}
          onClose={() => setModalData({ ...modalData, isOpen: false })}
          title={modalData.title}
          description={modalData.description}
          technologies={modalData.technologies}
        />

        {/* Admin Login Modal */}
        <AdminLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Administrative Panel */}
        <AdminPanel
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          onLogout={handleLogout}
          onProjectsUpdated={reloadData}
          onSettingsUpdated={reloadData}
        />
      </div>
    </MotionConfig>
  );
}

export default App;

