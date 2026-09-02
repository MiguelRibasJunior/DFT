import { useState, useEffect } from 'react';
import { GeometricCanvas } from './components/GeometricCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Solutions } from './components/Solutions';
import { Automation } from './components/Automation';
import { Differentials } from './components/Differentials';
import { Process } from './components/Process';
import { Portfolio } from './components/Portfolio';
import { TechStack } from './components/TechStack';
import { CTASection } from './components/CTASection';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminPanel } from './components/AdminPanel';

export function App() {
  const [selectedSolution, setSelectedSolution] = useState<string>('Automação com IA e n8n');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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

  useEffect(() => {
    const authSession = sessionStorage.getItem('dft_admin_authenticated');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleOpenAdminTrigger = () => {
    if (isAuthenticated) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAuthenticatedSuccess = () => {
    setIsAuthenticated(true);
    setIsAdminAuthModalOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('dft_admin_authenticated');
    sessionStorage.removeItem('dft_admin_token');
    setIsAuthenticated(false);
    setIsAdminPanelOpen(false);
  };

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

      {/* Main Header / Navbar */}
      <Navbar onOpenQuote={handleOpenQuote} onOpenAdmin={handleOpenAdminTrigger} />

      {/* Main Content Assembly */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero onOpenQuote={handleOpenQuote} />
        <Solutions onSelectSolution={handleSelectSolution} />
        <Automation onAutomateClick={handleOpenQuote} />
        <Differentials />
        <Process />
        <Portfolio onSelectProject={handleSelectProject} />
        <TechStack />
        <CTASection onStartProject={handleOpenQuote} />
        <ContactForm initialSolution={selectedSolution} onOpenAdmin={handleOpenAdminTrigger} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdminTrigger} />

      {/* Detail Modal */}
      <ProjectModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        description={modalData.description}
        technologies={modalData.technologies}
      />

      {/* Admin Auth Modal Challenge */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onAuthenticated={handleAuthenticatedSuccess}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onLogout={handleAdminLogout}
      />
    </div>
  );
}

export default App;
