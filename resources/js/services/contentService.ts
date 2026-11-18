import { ENV } from '@/config/env';
import type { PublicProject, PublicCta, PublicSiteSettings } from '@/types';

export type { PublicProject, PublicCta, PublicSiteSettings };

const STORAGE_PROJECTS_KEY = 'devs_custom_projects';
const STORAGE_SETTINGS_KEY = 'devs_custom_settings';

const INITIAL_PROJECTS: PublicProject[] = [
  {
    id: 1,
    title: 'Plataforma de Gestão',
    slug: 'plataforma-de-gestao',
    short_description: 'Sistema online para gerenciamento de processos, usuários, documentos e indicadores em tempo real.',
    description: 'Solução completa em Nuvem desenhada sob medida para empresas que buscam centralizar operação, fluxo financeiro e métricas de desempenho com segurança.',
    category: 'Sistema Web & Dashboard',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    cover_image: null,
    project_url: null,
    github_url: 'https://github.com/devs-from-tomorrow',
    external_url: null,
  },
  {
    id: 2,
    title: 'Assistente Virtual com IA',
    slug: 'assistente-virtual-ia',
    short_description: 'Chatbot inteligente integrado a bases de conhecimento, WhatsApp e ferramentas automáticas do n8n.',
    description: 'Atendimento inteligente 24/7 capaz de tirar dúvidas complexas, qualificar potenciais clientes e agendar reuniões de vendas automaticamente.',
    category: 'Chatbot & Automação n8n',
    technologies: ['Python', 'n8n', 'OpenAI', 'WhatsApp API'],
    cover_image: null,
    project_url: null,
    github_url: 'https://github.com/devs-from-tomorrow',
    external_url: null,
  },
  {
    id: 3,
    title: 'Aplicativo Personalizado',
    slug: 'aplicativo-personalizado',
    short_description: 'Aplicativo mobile moderno e fluido desenvolvido para facilitar serviços e comunicação direta.',
    description: 'App para iOS e Android com sincronização offline, notificações push e painel administrativo integrado.',
    category: 'Mobile iOS & Android',
    technologies: ['React Native', 'TypeScript', 'Node.js', 'Docker'],
    cover_image: null,
    project_url: null,
    github_url: 'https://github.com/devs-from-tomorrow',
    external_url: null,
  },
];

const INITIAL_SETTINGS: PublicSiteSettings = {
  site_name: 'Devs From Tomorrow',
  description: 'Desenvolvemos hoje as soluções digitais de amanhã. Especialistas em sistemas web, apps mobile, automação n8n e IA.',
  logo: '/favicon.svg',
  favicon: '/favicon.svg',
  phone: '+55 (11) 99999-9999',
  whatsapp: '+55 (11) 99999-9999',
  email: 'contato@devsfromtomorrow.com',
  address: 'São Paulo - SP, Brasil',
  instagram: 'https://www.instagram.com/devsfromtomorrow/',
  facebook: null,
  linkedin: 'https://linkedin.com/company/devs-from-tomorrow',
  youtube: null,
  github: 'https://github.com/devs-from-tomorrow',
  footer_links: null,
  copyright_text: '© 2026 Devs From Tomorrow. Todos os direitos reservados.',
  privacy_url: '#',
  terms_url: '#',
};

export const getProjects = async (
  initialProjects?: PublicProject[]
): Promise<PublicProject[]> => {
  if (initialProjects && initialProjects.length > 0) {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(initialProjects));
    return initialProjects;
  }

  // 1. Tentar API Backend
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/projects`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // API offline
  }

  // 2. Fallback com persistência local
  try {
    const raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch { }

  localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
  return INITIAL_PROJECTS;
};

export const saveProjects = (projects: PublicProject[]): void => {
  try {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Erro ao salvar projetos no localStorage:', err);
  }
};

export const addProject = (project: Omit<PublicProject, 'id'>): PublicProject => {
  const current = getLocalProjectsSync();
  const nextId = current.length > 0 ? Math.max(...current.map((p) => p.id)) + 1 : 1;
  const newProject: PublicProject = { ...project, id: nextId };
  const updated = [newProject, ...current];
  saveProjects(updated);
  return newProject;
};

export const updateProject = (id: number, data: Partial<PublicProject>): PublicProject[] => {
  const current = getLocalProjectsSync();
  const updated = current.map((p) => (p.id === id ? { ...p, ...data } : p));
  saveProjects(updated);
  return updated;
};

export const deleteProject = (id: number): PublicProject[] => {
  const current = getLocalProjectsSync();
  const updated = current.filter((p) => p.id !== id);
  saveProjects(updated);
  return updated;
};

function getLocalProjectsSync(): PublicProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

export const getSiteSettings = async (
  initialSettings?: PublicSiteSettings | null
): Promise<PublicSiteSettings> => {
  if (initialSettings) {
    const serverSettings = { ...INITIAL_SETTINGS, ...initialSettings };
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(serverSettings));
    return serverSettings;
  }

  try {
    const res = await fetch(`${ENV.API_BASE_URL}/settings`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return { ...INITIAL_SETTINGS, ...json.data };
      }
    }
  } catch { }

  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) {
      return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
    }
  } catch { }

  return INITIAL_SETTINGS;
};

export const saveSiteSettings = (settings: Partial<PublicSiteSettings>): PublicSiteSettings => {
  try {
    const current = getLocalSettingsSync();
    const merged = { ...current, ...settings };
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return INITIAL_SETTINGS;
  }
};

function getLocalSettingsSync(): PublicSiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    return raw ? { ...INITIAL_SETTINGS, ...JSON.parse(raw) } : INITIAL_SETTINGS;
  } catch {
    return INITIAL_SETTINGS;
  }
}

export const getCta = async (
  position: string,
  initialCta?: PublicCta | null
): Promise<PublicCta | null> => {
  if (position === 'cta_section' && initialCta) {
    return initialCta;
  }

  try {
    const res = await fetch(`${ENV.API_BASE_URL}/ctas/${position}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
};
