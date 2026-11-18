import { Link, Head } from '@inertiajs/react';
import { ArrowLeft, BookOpen, CheckCircle, Scale, ShieldAlert } from 'lucide-react';
import type { PublicSiteSettings } from '@/types';

interface TermsProps {
  settings?: PublicSiteSettings | null;
}

export default function Terms({ settings }: TermsProps) {
  const siteName = settings?.site_name || 'Devs From Tomorrow';
  const email = settings?.email || 'contato@devsfromtomorrow.com';

  return (
    <div style={{ minHeight: '100vh', background: '#080B14', color: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <Head title={`Termos de Uso — ${siteName}`} />

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
                background: 'rgba(35, 136, 255, 0.1)',
                border: '1px solid rgba(35, 136, 255, 0.25)',
                color: '#2388FF',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              <BookOpen size={14} />
              <span>Condições Gerais</span>
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
              Termos de Uso
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
                <CheckCircle size={18} color="#28D7E5" />
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao navegar ou utilizar os serviços do site da <strong>{siteName}</strong>, você concorda expressamente com os presentes Termos de Uso. Caso não concorde com qualquer disposição aqui estabelecida, recomendamos que encerre a navegação.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Scale size={18} color="#2388FF" />
                2. Escopo dos Serviços
              </h2>
              <p>
                A {siteName} atua no desenvolvimento sob medida de sistemas web, aplicativos móveis, fluxos automatizados com n8n e soluções integradas com inteligência artificial. Os projetos são formalizados mediante propostas técnicas e contratos específicos entre as partes.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={18} color="#7B4DFF" />
                3. Propriedade Intelectual
              </h2>
              <p>
                Todos os textos, marcas, logotipos, designs, códigos e estruturas visuais presentes neste site são de titularidade exclusiva da {siteName} ou devidamente licenciados, sendo vedada qualquer reprodução, distribuição ou engenharia reversa sem autorização prévia por escrito.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                4. Contato e Esclarecimentos
              </h2>
              <p>
                Dúvidas ou solicitações relacionadas a estes termos podem ser enviadas para:{' '}
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
