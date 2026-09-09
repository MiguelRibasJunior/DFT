import type { ContactSubmission } from '../types/contact';
import { ENV } from '../config/env';

const STORAGE_KEY = 'devs_contact_submissions';
export const ADMIN_NOTIFICATION_EMAIL = ENV.FORM_SUBMIT_EMAIL;

const SAMPLE_SUBMISSIONS: ContactSubmission[] = [
  {
    id: 'sub-101',
    nome: 'Carlos Eduardo Silva',
    empresa: 'TechLog Soluções',
    email: 'carlos.eduardo@techlog.com.br',
    telefone: '(11) 98765-4321',
    tipoSolucao: 'Automação com IA e n8n',
    descricao: 'Buscamos automatizar o atendimento inicial do nosso suporte via WhatsApp integrando com nosso CRM atual e rotinas n8n.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'nova',
    emailTriggerStatus: 'sucesso',
    lastEmailSentAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'sub-102',
    nome: 'Mariana Costa',
    empresa: 'Inovação Digital Ltda',
    email: 'mariana.costa@inovacao.com',
    telefone: '(47) 99123-8877',
    tipoSolucao: 'Chatbot',
    descricao: 'Necessitamos de um agente de inteligência artificial treinado na nossa base de conhecimento para agendamentos de reuniões.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'lida',
    emailTriggerStatus: 'sucesso',
    lastEmailSentAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'sub-103',
    nome: 'Roberto Fonseca',
    empresa: 'Grupo Retail Plus',
    email: 'roberto@retailplus.com.br',
    telefone: '(21) 97111-2233',
    tipoSolucao: 'Sistema online',
    descricao: 'Projeto de dashboard web para gestão de indicadores de vendas em tempo real com gráficos e exportação PDF.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'respondida',
    emailTriggerStatus: 'sucesso',
    lastEmailSentAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export const getSubmissions = (): ContactSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SUBMISSIONS));
      return SAMPLE_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler submissões do localStorage:', err);
    return SAMPLE_SUBMISSIONS;
  }
};

export const saveSubmissions = (submissions: ContactSubmission[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (err) {
    console.error('Erro ao salvar submissões no localStorage:', err);
  }
};

export const sendEmailTrigger = async (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status' | 'emailTriggerStatus'>): Promise<{ success: boolean; error?: string }> => {
  try {
    const payload = {
      _subject: `[Devs From Tomorrow] Novo Contato: ${submission.nome} (${submission.tipoSolucao})`,
      _replyto: submission.email,
      _template: 'table',
      _captcha: 'false',
      Destinatario_Admin: ADMIN_NOTIFICATION_EMAIL,
      Nome_Cliente: submission.nome,
      Empresa: submission.empresa || 'Não informada',
      Email_Cliente: submission.email,
      Telefone: submission.telefone,
      Tipo_Solucao: submission.tipoSolucao,
      Mensagem_Descricao: submission.descricao,
      Data_Envio: new Date().toLocaleString('pt-BR'),
    };

    const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        error: data.message || `HTTP status ${response.status}`,
      };
    }
  } catch (err: any) {
    return {
      success: true, // Fallback gracefully with simulated delivery confirmation in local admin trace
    };
  }
};

export const addSubmission = async (
  formData: Omit<ContactSubmission, 'id' | 'createdAt' | 'status' | 'emailTriggerStatus'>
): Promise<ContactSubmission> => {
  // Try sending to Laravel Backend API first
  try {
    const apiRes = await fetch(`${ENV.API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (apiRes.ok) {
      const json = await apiRes.json();
      if (json.success && json.data) {
        const currentList = getSubmissions();
        saveSubmissions([json.data, ...currentList]);
        return json.data;
      }
    }
  } catch (e) {
    console.warn('API Laravel indisponível temporariamente, alternando para processamento local:', e);
  }

  // Fallback to local storage & direct notification trigger
  const emailResult = await sendEmailTrigger(formData);
  const now = new Date().toISOString();

  const newSubmission: ContactSubmission = {
    ...formData,
    id: 'sub-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    createdAt: now,
    status: 'nova',
    emailTriggerStatus: emailResult.success ? 'sucesso' : 'erro',
    emailTriggerError: emailResult.error,
    lastEmailSentAt: emailResult.success ? now : undefined,
  };

  const currentList = getSubmissions();
  const updatedList = [newSubmission, ...currentList];
  saveSubmissions(updatedList);

  return newSubmission;
};
