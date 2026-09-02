export type SubmissionStatus = 'nova' | 'lida' | 'respondida';

export interface ContactSubmission {
  id: string;
  nome: string;
  empresa?: string;
  email: string;
  telefone: string;
  tipoSolucao: string;
  descricao: string;
  createdAt: string;
  status: SubmissionStatus;
  emailTriggerStatus?: 'sucesso' | 'erro' | 'pendente';
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
