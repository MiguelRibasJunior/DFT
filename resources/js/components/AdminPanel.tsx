import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Filter,
  Download,
  Mail,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  Send,
  Building,
  Phone,
  MessageSquare,
  ShieldCheck,
  Zap,
  Sparkles,
  Inbox,
  LogOut,
  Upload
} from 'lucide-react';
import type { ContactSubmission, SubmissionStatus } from '../types/contact';
import {
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  resetToSampleSubmissions,
  clearAllSubmissions,
  getSubmissionStats,
  exportSubmissionsCSV,
  sendEmailTrigger,
  ADMIN_NOTIFICATION_EMAIL,
} from '../services/submissionService';
import { validateFileUpload } from '../utils/security';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onLogout }) => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [solutionFilter, setSolutionFilter] = useState<string>('todos');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [activeTab, setActiveTab] = useState<'submissions' | 'email_settings'>('submissions');
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Load submissions whenever panel opens
  useEffect(() => {
    if (isOpen) {
      const data = getSubmissions();
      setSubmissions(data);
    }
  }, [isOpen]);

  const stats = useMemo(() => getSubmissionStats(submissions), [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch =
        sub.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.empresa && sub.empresa.toLowerCase().includes(searchTerm.toLowerCase())) ||
        sub.descricao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'todos' || sub.status === statusFilter;
      const matchesSolution = solutionFilter === 'todos' || sub.tipoSolucao === solutionFilter;

      return matchesSearch && matchesStatus && matchesSolution;
    });
  }, [submissions, searchTerm, statusFilter, solutionFilter]);

  const uniqueSolutions = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => set.add(s.tipoSolucao));
    return Array.from(set);
  }, [submissions]);

  const handleStatusChange = (id: string, newStatus: SubmissionStatus) => {
    const updated = updateSubmissionStatus(id, newStatus);
    setSubmissions(updated);
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta resposta?')) {
      const updated = deleteSubmission(id);
      setSubmissions(updated);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    }
  };

  const handleResetSample = () => {
    const resetData = resetToSampleSubmissions();
    setSubmissions(resetData);
  };

  const handleClearAll = () => {
    if (window.confirm('Deseja realmente apagar TODAS as respostas gravadas?')) {
      const cleared = clearAllSubmissions();
      setSubmissions(cleared);
      setSelectedSubmission(null);
    }
  };

  const handleManualEmailTrigger = async (sub: ContactSubmission) => {
    setTestSending(true);
    setTestResult(null);
    const res = await sendEmailTrigger({
      nome: sub.nome,
      empresa: sub.empresa,
      email: sub.email,
      telefone: sub.telefone,
      tipoSolucao: sub.tipoSolucao,
      descricao: sub.descricao,
    });
    setTestSending(false);
    if (res.success) {
      setTestResult(`E-mail de notificação re-enviado com sucesso para ${ADMIN_NOTIFICATION_EMAIL}!`);
    } else {
      setTestResult(`Erro no envio: ${res.error || 'Verifique sua conexão'}`);
    }
  };

  const handleTestEmailTrigger = async () => {
    setTestSending(true);
    setTestResult(null);
    const res = await sendEmailTrigger({
      nome: 'Teste do Painel Admin',
      empresa: 'Devs From Tomorrow Admin',
      email: 'admin.teste@devsfromtomorrow.com',
      telefone: '(00) 90000-0000',
      tipoSolucao: 'Automação com IA e n8n',
      descricao: 'Este é um e-mail de teste disparado pelo painel administrativo para validar o recebimento no e-mail nathalia.sampaio@aluno.unc.br.',
    });
    setTestSending(false);
    if (res.success) {
      setTestResult(`Sucesso! Notificação enviada para ${ADMIN_NOTIFICATION_EMAIL}.`);
    } else {
      setTestResult(`Falha ao disparar e-mail de teste: ${res.error}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFileUpload(file);
    if (!validation.valid) {
      setUploadNotice(`Erro no upload: ${validation.error}`);
      return;
    }

    setUploadNotice(`Arquivo "${file.name}" (${(file.size / 1024).toFixed(1)} KB) validado com sucesso!`);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-panel-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-card custom-scrollbar"
        style={{
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '92vh',
          background: 'rgba(12, 17, 31, 0.96)',
          border: '1px solid rgba(40, 215, 229, 0.25)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(40, 215, 229, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Admin Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(41, 50, 71, 0.8)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(35, 136, 255, 0.08) 0%, rgba(123, 77, 255, 0.08) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #28D7E5 0%, #2388FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(40, 215, 229, 0.3)',
              }}
            >
              <ShieldCheck size={24} color="#080B14" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 id="admin-panel-title" style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Painel Administrativo
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '10px',
                    background: 'rgba(40, 215, 229, 0.15)',
                    color: '#28D7E5',
                    border: '1px solid rgba(40, 215, 229, 0.3)',
                    letterSpacing: '0.05em',
                  }}
                >
                  LARAVEL + REACT
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-gray)', margin: 0 }}>
                Respostas dos questionários de contato e integração de e-mail (`{ADMIN_NOTIFICATION_EMAIL}`)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', background: 'rgba(8, 11, 20, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-gray)' }}>
              <button
                onClick={() => setActiveTab('submissions')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'submissions' ? 'var(--accent-blue)' : 'transparent',
                  color: activeTab === 'submissions' ? '#FFF' : 'var(--text-gray)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Inbox size={15} />
                <span>Respostas ({stats.total})</span>
              </button>
              <button
                onClick={() => setActiveTab('email_settings')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'email_settings' ? 'var(--accent-blue)' : 'transparent',
                  color: activeTab === 'email_settings' ? '#FFF' : 'var(--text-gray)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Mail size={15} />
                <span>Trigger E-mail</span>
              </button>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sair do painel administrativo"
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <LogOut size={14} />
                <span>Sair</span>
              </button>
            )}

            <button
              onClick={onClose}
              aria-label="Fechar painel admin"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-gray)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Dashboard Metrics Bar */}
        <div
          style={{
            padding: '16px 28px',
            background: 'rgba(8, 11, 20, 0.6)',
            borderBottom: '1px solid rgba(41, 50, 71, 0.5)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
          }}
        >
          {/* Card 1: Total */}
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16, 21, 36, 0.8)', border: '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(35, 136, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Inbox size={18} color="#2388FF" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 500 }}>Total de Submissões</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>{stats.total}</div>
            </div>
          </div>

          {/* Card 2: Novas */}
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16, 21, 36, 0.8)', border: stats.novas > 0 ? '1px solid rgba(40, 215, 229, 0.5)' : '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(40, 215, 229, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="#28D7E5" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 500 }}>Novas (Não lidas)</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#28D7E5' }}>{stats.novas}</div>
            </div>
          </div>

          {/* Card 3: Respondidas */}
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16, 21, 36, 0.8)', border: '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} color="#22C55E" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 500 }}>Respondidas</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#22C55E' }}>{stats.respondidas}</div>
            </div>
          </div>

          {/* Card 4: E-mails Disparados */}
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16, 21, 36, 0.8)', border: '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(123, 77, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#7B4DFF" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 500 }}>Trigger Envio Email</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#7B4DFF' }}>{stats.emailsEnviados}</div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          {activeTab === 'submissions' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Controls Bar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Search & Filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: 1 }}>
                  <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
                    <input
                      type="text"
                      placeholder="Buscar por nome, email, empresa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '38px', fontSize: '13px' }}
                    />
                  </div>

                  {/* Status filter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Filter size={15} color="var(--text-gray)" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="form-input"
                      style={{ width: 'auto', fontSize: '13px', padding: '10px 14px' }}
                    >
                      <option value="todos">Todos os Status</option>
                      <option value="nova">Apenas Novas</option>
                      <option value="lida">Apenas Lidas</option>
                      <option value="respondida">Apenas Respondidas</option>
                    </select>
                  </div>

                  {/* Solution filter */}
                  {uniqueSolutions.length > 0 && (
                    <select
                      value={solutionFilter}
                      onChange={(e) => setSolutionFilter(e.target.value)}
                      className="form-input"
                      style={{ width: 'auto', fontSize: '13px', padding: '10px 14px' }}
                    >
                      <option value="todos">Todas as Soluções</option>
                      {uniqueSolutions.map((sol) => (
                        <option key={sol} value={sol}>
                          {sol}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Bulk Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => exportSubmissionsCSV(filteredSubmissions)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                    title="Exportar respostas filtradas para CSV"
                  >
                    <Download size={15} />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={handleResetSample}
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                    title="Carregar dados fictícios para teste"
                  >
                    <RefreshCw size={15} />
                    <span>Restaurar Exemplo</span>
                  </button>
                  {submissions.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#EF4444',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      title="Limpar todos os registros salvos"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Submissions List / Table */}
              {filteredSubmissions.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'rgba(8, 11, 20, 0.4)',
                    borderRadius: '16px',
                    border: '1px dashed var(--border-gray)',
                  }}
                >
                  <Inbox size={48} color="var(--text-gray)" style={{ opacity: 0.5, marginBottom: '12px' }} />
                  <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#F5F7FA', marginBottom: '6px' }}>
                    Nenhuma resposta encontrada
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-gray)', maxWidth: '400px', margin: '0 auto 16px' }}>
                    Nenhum questionário preenchido corresponde aos filtros selecionados.
                  </p>
                  <button onClick={handleResetSample} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                    Carregar dados de demonstração
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: selectedSubmission ? '1fr 1fr' : '1fr', gap: '20px' }}>
                  {/* Table List */}
                  <div style={{ background: 'rgba(8, 11, 20, 0.6)', borderRadius: '14px', border: '1px solid var(--border-gray)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: 'rgba(16, 21, 36, 0.9)', borderBottom: '1px solid var(--border-gray)', color: 'var(--text-gray)' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Lead / Contato</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Solução</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Data</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSubmissions.map((sub) => {
                            const isSelected = selectedSubmission?.id === sub.id;
                            return (
                              <tr
                                key={sub.id}
                                onClick={() => setSelectedSubmission(sub)}
                                style={{
                                  borderBottom: '1px solid rgba(41, 50, 71, 0.4)',
                                  background: isSelected
                                    ? 'rgba(40, 215, 229, 0.08)'
                                    : sub.status === 'nova'
                                    ? 'rgba(35, 136, 255, 0.04)'
                                    : 'transparent',
                                  cursor: 'pointer',
                                  transition: 'background 0.2s ease',
                                }}
                              >
                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ fontWeight: 700, color: '#F5F7FA' }}>{sub.nome}</div>
                                  <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{sub.email}</div>
                                  {sub.empresa && (
                                    <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                                      🏢 {sub.empresa}
                                    </div>
                                  )}
                                </td>

                                <td style={{ padding: '14px 16px', color: 'var(--text-gray)' }}>
                                  <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11px', color: '#F5F7FA', fontWeight: 500 }}>
                                    {sub.tipoSolucao}
                                  </span>
                                </td>

                                <td style={{ padding: '14px 16px', color: 'var(--text-gray)', whiteSpace: 'nowrap', fontSize: '12px' }}>
                                  {new Date(sub.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </td>

                                <td style={{ padding: '14px 16px' }}>
                                  <select
                                    value={sub.status}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleStatusChange(sub.id, e.target.value as SubmissionStatus)}
                                    style={{
                                      padding: '4px 8px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      border: 'none',
                                      outline: 'none',
                                      cursor: 'pointer',
                                      background: sub.status === 'nova' ? 'rgba(40, 215, 229, 0.2)' : sub.status === 'respondida' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                      color: sub.status === 'nova' ? '#28D7E5' : sub.status === 'respondida' ? '#22C55E' : '#EAB308',
                                    }}
                                  >
                                    <option value="nova">Nova</option>
                                    <option value="lida">Lida</option>
                                    <option value="respondida">Respondida</option>
                                  </select>
                                </td>

                                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSubmission(sub);
                                      }}
                                      style={{ padding: '6px', borderRadius: '6px', background: 'rgba(35, 136, 255, 0.15)', border: 'none', color: '#2388FF', cursor: 'pointer' }}
                                      title="Visualizar detalhes"
                                    >
                                      <Eye size={15} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(sub.id);
                                      }}
                                      style={{ padding: '6px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                                      title="Excluir submissão"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Detail Inspector Drawer */}
                  {selectedSubmission && (
                    <div style={{ background: 'rgba(16, 21, 36, 0.95)', borderRadius: '14px', border: '1px solid rgba(40, 215, 229, 0.3)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative', maxHeight: '600px', overflowY: 'auto' }}>
                      <button
                        onClick={() => setSelectedSubmission(null)}
                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-gray)', cursor: 'pointer' }}
                      >
                        <X size={18} />
                      </button>

                      <div style={{ borderBottom: '1px solid var(--border-gray)', paddingBottom: '12px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Detalhes da Mensagem #{selectedSubmission.id}
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                          {selectedSubmission.nome}
                        </h3>
                        <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '2px' }}>
                          Recebido em {new Date(selectedSubmission.createdAt).toLocaleString('pt-BR')}
                        </div>
                      </div>

                      {/* Lead Info Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ background: 'rgba(8, 11, 20, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-gray)' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-gray)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Mail size={13} color="#2388FF" /> E-mail
                          </div>
                          <a href={`mailto:${selectedSubmission.email}`} style={{ fontSize: '13px', fontWeight: 600, color: '#F5F7FA', textDecoration: 'underline' }}>
                            {selectedSubmission.email}
                          </a>
                        </div>

                        <div style={{ background: 'rgba(8, 11, 20, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-gray)' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-gray)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={13} color="#28D7E5" /> Telefone / WhatsApp
                          </div>
                          <a href={`https://wa.me/55${selectedSubmission.telefone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '13px', fontWeight: 600, color: '#28D7E5', textDecoration: 'none' }}>
                            {selectedSubmission.telefone}
                          </a>
                        </div>

                        <div style={{ background: 'rgba(8, 11, 20, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-gray)' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-gray)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Building size={13} color="#7B4DFF" /> Empresa
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#F5F7FA' }}>
                            {selectedSubmission.empresa || 'Não informada'}
                          </div>
                        </div>

                        <div style={{ background: 'rgba(8, 11, 20, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-gray)' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-gray)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={13} color="#EAB308" /> Solução Solicitada
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#28D7E5' }}>
                            {selectedSubmission.tipoSolucao}
                          </div>
                        </div>
                      </div>

                      {/* Description Box */}
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MessageSquare size={14} color="#28D7E5" /> Descrição do Projeto / Necessidade
                        </div>
                        <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(8, 11, 20, 0.8)', border: '1px solid var(--border-gray)', color: '#F5F7FA', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {selectedSubmission.descricao}
                        </div>
                      </div>

                      {/* Email Trigger Status Pill */}
                      <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(123, 77, 255, 0.1)', border: '1px solid rgba(123, 77, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={16} color="#7B4DFF" />
                          <div>
                            <span style={{ color: 'var(--text-gray)' }}>Notification Trigger: </span>
                            <strong style={{ color: '#F5F7FA' }}>{ADMIN_NOTIFICATION_EMAIL}</strong>
                          </div>
                        </div>
                        <button
                          onClick={() => handleManualEmailTrigger(selectedSubmission)}
                          disabled={testSending}
                          style={{ padding: '4px 10px', borderRadius: '6px', background: '#7B4DFF', border: 'none', color: '#FFF', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          {testSending ? 'Enviando...' : 'Re-enviar Notificação'}
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px', flexWrap: 'wrap' }}>
                        <a
                          href={`mailto:${selectedSubmission.email}?cc=${ADMIN_NOTIFICATION_EMAIL}&subject=Contato Devs From Tomorrow - Resposta ao Projeto: ${encodeURIComponent(selectedSubmission.tipoSolucao)}&body=Olá ${encodeURIComponent(selectedSubmission.nome)},\n\nObrigado por entrar em contato com a Devs From Tomorrow! Analisamos a sua solicitação sobre ${encodeURIComponent(selectedSubmission.tipoSolucao)}.\n\nAtenciosamente,\nEquipe Devs From Tomorrow`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '10px', fontSize: '13px', justifyContent: 'center' }}
                        >
                          <Send size={15} />
                          <span>Responder via E-mail</span>
                        </a>

                        <button
                          onClick={() => handleStatusChange(selectedSubmission.id, 'respondida')}
                          className="btn btn-secondary"
                          style={{ padding: '10px 14px', fontSize: '13px' }}
                        >
                          <CheckCircle2 size={15} color="#22C55E" />
                          <span>Marcar Respondida</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Settings & File Upload Tab */
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(16, 21, 36, 0.8)', border: '1px solid rgba(40, 215, 229, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(40, 215, 229, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={24} color="#28D7E5" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF' }}>
                      Configuração de Trigger & Validador de Upload
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>
                      Notificações automáticas para submissões e teste de upload seguro de anexos.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(8, 11, 20, 0.8)', border: '1px solid var(--border-gray)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600 }}>E-mail de Destino do Administrador</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#28D7E5', marginTop: '2px' }}>{ADMIN_NOTIFICATION_EMAIL}</div>
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22C55E', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} /> Ativo & Monitorado
                    </span>
                  </div>

                  {/* Upload Security Tester */}
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(8, 11, 20, 0.8)', border: '1px solid var(--border-gray)' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Upload size={16} color="#28D7E5" /> Validação de Upload Seguro de Anexos
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '12px' }}>
                      Tipos permitidos: PNG, JPG, WebP, SVG, PDF. Limite máximo: 5MB.
                    </p>
                    <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg,.pdf" onChange={handleFileUpload} style={{ fontSize: '13px', color: 'var(--text-gray)' }} />
                    {uploadNotice && (
                      <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: uploadNotice.includes('Erro') ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)', border: uploadNotice.includes('Erro') ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)', color: uploadNotice.includes('Erro') ? '#EF4444' : '#22C55E', fontSize: '12px', fontWeight: 600 }}>
                        {uploadNotice}
                      </div>
                    )}
                  </div>

                  {/* Test Action */}
                  <div style={{ marginTop: '10px' }}>
                    <button onClick={handleTestEmailTrigger} disabled={testSending} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                      {testSending ? <span>Enviando disparo de teste...</span> : <><Send size={16} /><span>Disparar E-mail de Teste para {ADMIN_NOTIFICATION_EMAIL}</span></>}
                    </button>

                    {testResult && (
                      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: testResult.includes('Sucesso') || testResult.includes('sucesso') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: testResult.includes('Sucesso') || testResult.includes('sucesso') ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)', color: testResult.includes('Sucesso') || testResult.includes('sucesso') ? '#22C55E' : '#EF4444', fontSize: '13px', fontWeight: 600 }}>
                        {testResult}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
