import { useEffect, useState } from 'react';
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
import { getProjects, type PublicProject } from './services/contentService';

export function App() {
  const [selectedSolution, setSelectedSolution] = useState<string>('Automação com IA e n8n');
  const [projects, setProjects] = useState<PublicProject[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
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

      {/* Main Header / Navbar */}
      <Navbar onOpenQuote={handleOpenQuote} />

      {/* Main Content Assembly */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero onOpenQuote={handleOpenQuote} />
        <Solutions onSelectSolution={handleSelectSolution} />
        <Automation onAutomateClick={handleOpenQuote} />
        <Differentials />
        <Process />
        <Portfolio onSelectProject={handleSelectProject} projects={projects} />
        <TechStack />
        <CTASection onStartProject={handleOpenQuote} />
        <ContactForm initialSolution={selectedSolution} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Detail Modal */}
      <ProjectModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        description={modalData.description}
        technologies={modalData.technologies}
      />
    </div>
  );
}

export default App;
