import { ENV } from '../config/env';

export interface PublicProject {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category: string;
  technologies: string[] | null;
  cover_image: string | null;
  project_url: string | null;
  github_url: string | null;
  external_url: string | null;
}

export interface PublicCta {
  title: string;
  subtitle: string | null;
  button_text: string;
  button_url: string;
}

export interface PublicSiteSettings {
  site_name: string;
  description: string | null;
  logo: string | null;
  favicon: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  youtube: string | null;
  github: string | null;
  footer_links: { label: string; url: string }[] | null;
  copyright_text: string | null;
  privacy_url: string | null;
  terms_url: string | null;
}

export const getProjects = async (): Promise<PublicProject[]> => {
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/projects`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
};

export const getCta = async (position: string): Promise<PublicCta | null> => {
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/ctas/${position}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
};

export const getSiteSettings = async (): Promise<PublicSiteSettings | null> => {
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/settings`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
};
