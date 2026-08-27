import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { addSubmission, ADMIN_NOTIFICATION_EMAIL } from '../services/submissionService';

interface ContactFormProps {
  initialSolution?: string;
  onOpenAdmin?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialSolution = '', onOpenAdmin }) => {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    tipoSolucao: initialSolution || 'Automação com IA e n8n',
    descricao: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [triggerNotice, setTriggerNotice] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const created = await addSubmission({
        nome: formData.nome,
        empresa: formData.empresa,
        email: formData.email,
        telefone: formData.telefone,
        tipoSolucao: formData.tipoSolucao,
        descricao: formData.descricao,
      });

      setLoading(false);
      setSubmitted(true);
      setTriggerNotice(
        created.emailTriggerStatus === 'sucesso'
          ? `Notificação por e-mail enviada para ${ADMIN_NOTIFICATION_EMAIL}!`
          : `Resposta armazenada no Painel Admin.`
      );
    } catch (err) {
      console.error('Erro ao enviar questionário:', err);
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section id="contato" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'rgba(35, 136, 255, 0.1)',
              border: '1px solid rgba(35, 136, 255, 0.3)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent-blue)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
            }}
          >
            Fale Conosco
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800 }}>
            Entre em <span className="text-gradient">contato</span>
          </h2>
        </div>

        <div className="contact-grid">
          {/* Form Column */}
          <div className="glass-card" style={{ padding: '36px 30px', background: 'rgba(16, 21, 36, 0.9)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(40, 215, 229, 0.15)',
                    border: '2px solid #28D7E5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <CheckCircle2 size={36} color="#28D7E5" />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: '#F5F7FA' }}>
                  Mensagem enviada com sucesso!
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-gray)', maxWidth: '420px', margin: '0 auto 16px', lineHeight: 1.6 }}>
                  Obrigado pelo contato! Sua resposta foi gravada no painel administrativo e a notificação foi enviada.
                </p>
                {triggerNotice && (
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--accent-cyan)',
                      background: 'rgba(40, 215, 229, 0.1)',
                      border: '1px solid rgba(40, 215, 229, 0.25)',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      maxWidth: '420px',
                      margin: '0 auto 24px',
                    }}
                  >
                    ✉️ {triggerNotice}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ nome: '', empresa: '', email: '', telefone: '', tipoSolucao: 'Automação com IA e n8n', descricao: '' });
                    }}
                    className="btn btn-secondary"
                  >
                    Enviar outra mensagem
                  </button>
                  {onOpenAdmin && (
                    <button onClick={onOpenAdmin} className="btn btn-primary" style={{ fontSize: '13px' }}>
                      <ShieldCheck size={16} />
                      <span>Ver no Painel Admin</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  {/* Nome */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  {/* Empresa */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                      Empresa
                    </label>
                    <input
                      type="text"
                      placeholder="Nome da sua empresa"
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  {/* E-mail */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                      E-mail profissional *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seu.email@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  {/* Telefone / WhatsApp */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                      Telefone ou WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Tipo de Solução */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                    Tipo de solução desejada *
                  </label>
                  <select
                    value={formData.tipoSolucao}
                    onChange={(e) => setFormData({ ...formData, tipoSolucao: e.target.value })}
                    className="form-input"
                    style={{ appearance: 'none' }}
                  >
                    <option value="Chatbot">Chatbot Inteligente</option>
                    <option value="Automação com IA e n8n">Automação com IA e n8n</option>
                    <option value="Aplicativo">Aplicativo Android / iOS</option>
                    <option value="Site">Site Institucional</option>
                    <option value="Sistema online">Sistema Online / SaaS</option>
                    <option value="Integração entre sistemas">Integração entre Sistemas / APIs</option>
                    <option value="Outra solução">Outra solução personalizada</option>
                  </select>
                </div>

                {/* Descrição do Projeto */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                    Descrição do projeto ou necessidade *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Conte um pouco sobre os objetivos do seu projeto, prazos ou especificações..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
                  {loading ? (
                    <span>Enviando dados...</span>
                  ) : (
                    <>
                      <span>Enviar mensagem</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Direct Info Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                Vamos conversar sobre seu <span className="text-cyan">projeto</span>
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-gray)', lineHeight: 1.6 }}>
                Estamos prontos para entender seus desafios e construir a melhor arquitetura de software, automação ou inteligência para seu negócio.
              </p>
            </div>

            {/* Response Time Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 18px',
                borderRadius: '12px',
                background: 'rgba(40, 215, 229, 0.08)',
                border: '1px solid rgba(40, 215, 229, 0.3)',
                fontSize: '13px',
                color: 'var(--accent-cyan)',
                fontWeight: 600,
              }}
            >
              <Clock size={18} />
              <span>Respondemos normalmente em até um dia útil.</span>
            </div>

            {/* Direct Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a
                href="mailto:contato@devsfromtomorrow.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(16, 21, 36, 0.7)',
                  border: '1px solid var(--border-gray)',
                  color: '#F5F7FA',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                className="contact-link"
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(35, 136, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} color="#2388FF" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>E-mail corporativo</div>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>contato@devsfromtomorrow.com</div>
                </div>
              </a>

              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(16, 21, 36, 0.7)',
                  border: '1px solid var(--border-gray)',
                  color: '#F5F7FA',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                className="contact-link"
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(40, 215, 229, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} color="#28D7E5" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>WhatsApp Oficial</div>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>+55 (11) 99999-9999</div>
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: 600, marginBottom: '12px' }}>
                Redes Sociais & Comunidade:
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="#" className="social-button" style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 21, 36, 0.8)', border: '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5F7FA' }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94Z"/></svg>
                </a>
                <a href="#" className="social-button" style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 21, 36, 0.8)', border: '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5F7FA' }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="social-button" style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 21, 36, 0.8)', border: '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5F7FA' }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 992px) {
          .contact-grid {
            grid-template-columns: 1.15fr 0.85fr;
            gap: 48px;
          }
        }
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(8, 11, 20, 0.8);
          border: 1px solid var(--border-gray);
          color: #F5F7FA;
          font-family: var(--font-body);
          font-size: 14px;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .form-input:focus {
          border-color: #28D7E5;
          box-shadow: 0 0 12px rgba(40, 215, 229, 0.25);
        }
        .contact-link:hover {
          border-color: #28D7E5;
        }
        .social-button:hover {
          border-color: #7B4DFF;
          color: #28D7E5;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
};
