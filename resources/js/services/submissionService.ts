import { ENV } from '../config/env';

export interface ContactPayload {
  nome: string;
  empresa?: string;
  email: string;
  telefone: string;
  tipoSolucao: string;
  descricao: string;
}

export class SubmissionError extends Error {
  readonly kind: 'validation' | 'rate-limit' | 'server' | 'network';

  constructor(kind: SubmissionError['kind'], message: string) {
    super(message);
    this.kind = kind;
  }
}

const SERVER_FALLBACK_MESSAGE =
  'Não foi possível enviar sua mensagem agora. Tente novamente em instantes ou fale conosco por e-mail ou WhatsApp.';

export const addSubmission = async (payload: ContactPayload): Promise<void> => {
  let response: Response;

  try {
    response = await fetch(`${ENV.API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new SubmissionError('network', 'Sem conexão com o servidor. Verifique sua internet e tente novamente.');
  }

  if (response.ok) return;

  if (response.status === 422) {
    const body = await response.json().catch(() => null);
    const errors: Record<string, string[]> = body?.errors ?? {};
    const messages = Object.values(errors).flat();
    throw new SubmissionError('validation', messages.length ? messages.join(' ') : 'Revise os dados informados e tente novamente.');
  }

  if (response.status === 429) {
    throw new SubmissionError('rate-limit', 'Você enviou muitas mensagens em pouco tempo. Aguarde um minuto e tente novamente.');
  }

  throw new SubmissionError('server', SERVER_FALLBACK_MESSAGE);
};
