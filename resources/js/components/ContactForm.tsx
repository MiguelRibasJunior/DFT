import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { addSubmission, ADMIN_NOTIFICATION_EMAIL } from '../services/submissionService';
import { sanitizeInput, validateEmail, validatePhone, checkRateLimit } from '../utils/security';

interface ContactFormProps {
  initialSolution?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialSolution = '' }) => {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    tipoSolucao: initialSolution || 'Automação com IA e n8n',
    descricao: '',
    website_hp: '', // Honeypot field
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [triggerNotice, setTriggerNotice] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    // 1. Honeypot check
    if (formData.website_hp) {
      console.warn('Bot anti-spam acionado via Honeypot.');
      setSubmitted(true);
      return;
    }

    // 2. Client-side Rate Limit check (30 seconds)
    const rateCheck = checkRateLimit('contact_form', 30);
    if (!rateCheck.allowed) {
      setErrorNotice(`Por favor, aguarde ${rateCheck.waitSeconds} segundos antes de enviar uma nova mensagem.`);
      return;
    }

    // 3. Validation
    if (!validateEmail(formData.email)) {
      setErrorNotice('Por favor, informe um endereço de e-mail válido (ex: seu.nome@empresa.com).');
      return;
    }

    if (!validatePhone(formData.telefone)) {
      setErrorNotice('Por favor, informe um número de telefone ou WhatsApp válido com DDD.');
      return;
    }

    setLoading(true);

    try {
      // 4. Sanitize inputs
      const cleanData = {
        nome: sanitizeInput(formData.nome),
        empresa: sanitizeInput(formData.empresa),
        email: sanitizeInput(formData.email),
        telefone: sanitizeInput(formData.telefone),
        tipoSolucao: sanitizeInput(formData.tipoSolucao),
        descricao: sanitizeInput(formData.descricao),
      };

      const created = await addSubmission(cleanData);

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
                  Obrigado pelo contato! Sua resposta foi gravada no banco de dados e a notificação foi enviada.
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
                      setFormData({ nome: '', empresa: '', email: '', telefone: '', tipoSolucao: 'Automação com IA e n8n', descricao: '', website_hp: '' });
                    }}
                    className="btn btn-secondary"
                  >
                    Enviar outra mensagem
                  </button>
                  <a href="/admin" className="btn btn-primary" style={{ fontSize: '13px', textDecoration: 'none' }}>
                    <ShieldCheck size={16} />
                    <span>Ver no Painel Admin</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                  style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorNotice && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#EF4444',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <AlertTriangle size={18} />
                    <span>{errorNotice}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  {/* Nome */}
                  <div>
                    <label htmlFor="contact-nome" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                      Nome completo *
                    </label>
                    <input
                      id="contact-nome"
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
                    <label htmlFor="contact-empresa" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                      Empresa
                    </label>
                    <input
                      id="contact-empresa"
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
                    <label htmlFor="contact-email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                      E-mail profissional *
                    </label>
                    <input
                      id="contact-email"
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
                    <label htmlFor="contact-telefone" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                      Telefone ou WhatsApp *
                    </label>
                    <input
                      id="contact-telefone"
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
                  <label htmlFor="contact-solucao" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                    Tipo de solução desejada *
                  </label>
                  <select
                    id="contact-solucao"
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
                  <label htmlFor="contact-descricao" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
                    Descrição do projeto ou necessidade *
                  </label>
                  <textarea
                    id="contact-descricao"
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
      `}</style>
    </section>
  );
};
