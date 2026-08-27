export type SubmissionStatus = 'nova' | 'lida' | 'respondida';

export type EmailTriggerStatus = 'sucesso' | 'erro' | 'pendente' | 'simulado';

export interface ContactSubmission {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  tipoSolucao: string;
  descricao: string;
  createdAt: string; // ISO string
  status: SubmissionStatus;
  emailTriggerStatus: EmailTriggerStatus;
  emailTriggerError?: string;
  lastEmailSentAt?: string;
}

export interface SubmissionStats {
  total: number;
  novas: number;
  lidas: number;
  respondidas: number;
  emailsEnviados: number;
}
