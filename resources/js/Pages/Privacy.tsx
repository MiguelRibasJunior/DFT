import { Link, Head } from '@inertiajs/react';
import { ArrowLeft, Shield, Lock, FileText, CheckCircle } from 'lucide-react';
import type { PublicSiteSettings } from '@/types';

interface PrivacyProps {
  settings?: PublicSiteSettings | null;
}

export default function Privacy({ settings }: PrivacyProps) {
  const siteName = settings?.site_name || 'Devs From Tomorrow';
  const email = settings?.email || 'contato@devsfromtomorrow.com';

  return (
    <div style={{ minHeight: '100vh', background: '#080B14', color: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <Head title={`Política de Privacidade — ${siteName}`} />

      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid rgba(41, 50, 71, 0.6)',
          background: 'rgba(8, 11, 20, 0.95)',
          backdropFilter: 'blur(16px)',
          padding: '18px 0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px' }}>
              <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
                <polygon points="20,4 6,34 34,34" stroke="#28D7E5" strokeWidth="2.5" fill="none" />
                <polygon points="20,12 12,28 28,28" fill="#7B4DFF" opacity="0.8" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', color: '#FFFFFF' }}>
              Devs From <span className="text-cyan">Tomorrow</span>
            </span>
          </Link>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: 'var(--accent-cyan)',
              textDecoration: 'none',
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(40, 215, 229, 0.08)',
              border: '1px solid rgba(40, 215, 229, 0.2)',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={16} />
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'rgba(40, 215, 229, 0.1)',
                border: '1px solid rgba(40, 215, 229, 0.25)',
                color: 'var(--accent-cyan)',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              <Shield size={14} />
              <span>Privacidade e Segurança</span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '12px',
                letterSpacing: '-0.02em',
              }}
            >
              Política de Privacidade
            </h1>
            <p style={{ color: 'var(--text-gray)', fontSize: '15px' }}>
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div
            style={{
              background: 'rgba(16, 21, 36, 0.6)',
              border: '1px solid var(--border-gray)',
              borderRadius: '16px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
              lineHeight: 1.7,
              fontSize: '15px',
              color: 'var(--text-gray)',
            }}
          >
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={18} color="#28D7E5" />
                1. Compromisso com a Privacidade
              </h2>
              <p>
                A <strong>{siteName}</strong> valoriza a segurança e confidencialidade dos dados de seus clientes, parceiros e visitantes. Esta política descreve como tratamos e protegemos as informações fornecidas através do nosso site e canais de atendimento, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={18} color="#2388FF" />
                2. Dados Coletados e Finalidade
              </h2>
              <p>
                Coletamos dados fornecidos voluntariamente através dos formulários de contato e orçamento:
              </p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Nome completo e empresa representante;</li>
                <li>E-mail corporativo e número de telefone/WhatsApp;</li>
                <li>Descrição das necessidades do projeto e tipo de solução desejada.</li>
              </ul>
              <p style={{ marginTop: '10px' }}>
                Esses dados são utilizados exclusivamente para responder às solicitações comerciais, elaborar propostas técnicas e prestar suporte aos nossos serviços de desenvolvimento e automação.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={18} color="#7B4DFF" />
                3. Segurança da Informação
              </h2>
              <p>
                Adotamos medidas técnicas e organizacionais de proteção, incluindo criptografia SSL/TLS em todas as comunicações, políticas de acesso restrito e proteção contra tentativas abusivas de envio (rate limiting). Não comercializamos nem compartilhamos dados com terceiros para fins de marketing.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                4. Seus Direitos
              </h2>
              <p>
                Você tem o direito de solicitar a confirmação, o acesso, a retificação ou a exclusão definitiva dos seus dados armazenados em nossos registros. Para exercer esses direitos, entre em contato através do e-mail{' '}
                <a href={`mailto:${email}`} style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                  {email}
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(41, 50, 71, 0.4)', padding: '24px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-gray)' }}>
        <div className="container">
          <p>{settings?.copyright_text || `© ${new Date().getFullYear()} ${siteName}. Todos os direitos reservados.`}</p>
        </div>
      </footer>
    </div>
  );
}
