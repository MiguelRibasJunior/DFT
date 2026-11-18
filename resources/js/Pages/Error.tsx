import { Link, Head, usePage } from '@inertiajs/react';
import { AlertTriangle, RefreshCw, Terminal, Home } from 'lucide-react';

interface ErrorProps {
  status: number;
  message?: string;
  trace?: string;
}

const ERROR_INFO: Record<number, { title: string; description: string }> = {
  404: {
    title: 'Página Não Encontrada',
    description: 'A página que você está procurando não existe, foi removida ou o endereço digitado está incorreto.',
  },
  500: {
    title: 'Erro Interno do Servidor',
    description: 'Ocorreu uma falha inesperada durante o processamento da sua solicitação. Nossa equipe foi notificada.',
  },
  403: {
    title: 'Acesso Proibido',
    description: 'Você não possui as permissões necessárias para acessar este recurso.',
  },
  503: {
    title: 'Serviço em Manutenção',
    description: 'O sistema está temporariamente indisponível para atualização. Retorne em alguns minutos.',
  },
  419: {
    title: 'Página Expirada',
    description: 'A sessão de segurança expirou por inatividade. Atualize a página para continuar.',
  },
};

export default function ErrorPage({ status = 500, message, trace }: ErrorProps) {
  const { props } = usePage<{ app?: { env?: string; debug?: boolean } }>();
  const isLocal = props.app?.env === 'local' || props.app?.debug === true;

  const info = ERROR_INFO[status] || {
    title: 'Erro Inesperado',
    description: 'Não foi possível completar a operação solicitada.',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080B14',
        color: '#F5F7FA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Head title={`${status} — ${info.title}`} />

      {/* Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123, 77, 255, 0.15) 0%, rgba(8, 11, 20, 0) 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '580px',
          width: '100%',
          background: 'rgba(16, 21, 36, 0.85)',
          border: '1px solid var(--border-gray)',
          borderRadius: '20px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(255, 68, 68, 0.12)',
            border: '1px solid rgba(255, 68, 68, 0.3)',
            color: '#FF6B6B',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '24px',
          }}
        >
          <AlertTriangle size={15} />
          <span>Status {status}</span>
        </div>

        {/* Big Code */}
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(54px, 12vw, 84px)',
            fontWeight: 800,
            lineHeight: 1,
            color: '#FFFFFF',
            letterSpacing: '-0.04em',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A2B2CC 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {status}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '22px',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '12px',
          }}
        >
          {info.title}
        </h1>

        <p
          style={{
            color: 'var(--text-gray)',
            fontSize: '15px',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          {message || info.description}
        </p>

        {/* Diagnostic info for local development */}
        {isLocal && (message || trace) && (
          <div
            style={{
              textAlign: 'left',
              background: '#04060A',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '28px',
              fontSize: '13px',
              fontFamily: 'monospace',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF6B6B', fontWeight: 600, marginBottom: '8px' }}>
              <Terminal size={14} />
              <span>Ambiente Local — Diagnóstico de Erro:</span>
            </div>
            {message && <p style={{ color: '#F5F7FA', wordBreak: 'break-word', margin: 0 }}>{message}</p>}
            {trace && (
              <pre style={{ marginTop: '10px', maxHeight: '160px', overflowY: 'auto', fontSize: '11px', color: '#8899B5' }}>
                {trace}
              </pre>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2388FF 0%, #7B4DFF 100%)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(35, 136, 255, 0.35)',
            }}
          >
            <Home size={16} />
            <span>Voltar ao Início</span>
          </Link>

          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-gray)',
              color: '#F5F7FA',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} />
            <span>Tentar Novamente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
