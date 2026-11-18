import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  MessageSquare,
  Search,
  Download,
  ShieldCheck,
  RefreshCw,
  Mail,
  Phone,
  Key,
  Save,
  Check,
  Eye,
  X
} from 'lucide-react';
import type {
  AdminUser,
  ContactSubmission,
  PublicProject,
  PublicSiteSettings,
  SubmissionStatus,
} from '@/types';
import {
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  exportSubmissionsCSV,
  resetToSampleSubmissions,
} from '@/services/submissionService';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getSiteSettings,
  saveSiteSettings,
} from '@/services/contentService';
import {
  getCurrentUser,
  logout,
  changePassword,
} from '@/services/authService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onProjectsUpdated?: () => void;
  onSettingsUpdated?: () => void;
}

type TabType = 'dashboard' | 'submissions' | 'projects' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onLogout,
  onProjectsUpdated,
  onSettingsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Submissions State
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  // Projects State
  const [projectsList, setProjectsList] = useState<PublicProject[]>([]);
  const [editingProject, setEditingProject] = useState<PublicProject | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState<string | null>(null);

  // Password Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passNotice, setPassNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load initial data
  useEffect(() => {
    if (isOpen) {
      setCurrentUser(getCurrentUser());
      loadSubmissions();
      loadProjects();
      loadSettings();
    }
  }, [isOpen]);

  const loadSubmissions = () => {
    setSubmissions(getSubmissions());
  };

  const loadProjects = () => {
    getProjects().then((data) => setProjectsList(data));
  };

  const loadSettings = () => {
    getSiteSettings().then((data) => setSettings(data));
  };

  // Submissions computed & actions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        item.nome.toLowerCase().includes(query) ||
        (item.empresa && item.empresa.toLowerCase().includes(query)) ||
        item.email.toLowerCase().includes(query) ||
        item.tipoSolucao.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [submissions, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = submissions.length;
    const novas = submissions.filter((s) => s.status === 'nova').length;
    const lidas = submissions.filter((s) => s.status === 'lida').length;
    const respondidas = submissions.filter((s) => s.status === 'respondida').length;

    // Solution breakdown
    const solutionsMap: Record<string, number> = {};
    submissions.forEach((s) => {
      solutionsMap[s.tipoSolucao] = (solutionsMap[s.tipoSolucao] || 0) + 1;
    });

    return { total, novas, lidas, respondidas, solutionsMap };
  }, [submissions]);

  const handleStatusChange = (id: string, status: SubmissionStatus) => {
    const updated = updateSubmissionStatus(id, status);
    setSubmissions(updated);
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status });
    }
  };

  const handleDeleteSubmission = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem de contato?')) {
      const updated = deleteSubmission(id);
      setSubmissions(updated);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    }
  };

  const handleExportCSV = () => {
    exportSubmissionsCSV(submissions);
  };

  // Project Actions
  const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const short_description = formData.get('short_description') as string;
    const description = formData.get('description') as string;
    const rawTechs = formData.get('technologies') as string;
    const github_url = formData.get('github_url') as string;
    const project_url = formData.get('project_url') as string;

    const technologies = rawTechs
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      const updated = updateProject(editingProject.id, {
        title,
        category,
        short_description,
        description,
        technologies,
        github_url: github_url || null,
        project_url: project_url || null,
      });
      setProjectsList(updated);
    } else {
      addProject({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        short_description,
        description,
        technologies,
        cover_image: null,
        github_url: github_url || null,
        project_url: project_url || null,
        external_url: null,
      });
      loadProjects();
    }

    setIsProjectModalOpen(false);
    setEditingProject(null);
    onProjectsUpdated?.();
  };

  const handleDeleteProject = (id: number) => {
    if (window.confirm('Deseja realmente remover este projeto do portfólio?')) {
      const updated = deleteProject(id);
      setProjectsList(updated);
      onProjectsUpdated?.();
    }
  };

  // Settings Actions
  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;

    const updated = saveSiteSettings(settings);
    setSettings(updated);
    setSettingsSavedNotice('Configurações atualizadas com sucesso!');
    setTimeout(() => setSettingsSavedNotice(null), 3000);
    onSettingsUpdated?.();
  };

  // Password Actions
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassNotice(null);

    if (newPass !== confirmPass) {
      setPassNotice({ type: 'error', text: 'A confirmação de senha não confere.' });
      return;
    }

    const res = await changePassword(currentPass, newPass);
    if (res.success) {
      setPassNotice({ type: 'success', text: 'Senha alterada com sucesso!' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassNotice({ type: 'error', text: res.error || 'Erro ao alterar senha.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: '#070A13',
        color: '#F0F4FC',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          height: '70px',
          borderBottom: '1px solid rgba(41, 50, 71, 0.7)',
          backgroundColor: 'rgba(10, 14, 26, 0.95)',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(40, 215, 229, 0.2), rgba(123, 77, 255, 0.2))',
              border: '1px solid rgba(40, 215, 229, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#28D7E5',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '17px' }}>
                Devs From Tomorrow
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(40, 215, 229, 0.15)',
                  color: '#28D7E5',
                  border: '1px solid rgba(40, 215, 229, 0.3)',
                }}
              >
                Painel Administrativo
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
              Conectado como: <strong style={{ color: '#CBD5E1' }}>{currentUser?.name || 'Administrador'}</strong> ({currentUser?.email})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '8px 16px',
              color: '#CBD5E1',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
          >
            <ExternalLink size={15} />
            Ver Site Público
          </button>

          <button
            onClick={() => {
              logout();
              onLogout();
            }}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '8px 16px',
              color: '#F87171',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)')}
          >
            <LogOut size={15} />
            Sair
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar Tabs */}
        <aside
          style={{
            width: '240px',
            backgroundColor: 'rgba(10, 14, 24, 0.7)',
            borderRight: '1px solid rgba(41, 50, 71, 0.5)',
            padding: '24px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'dashboard' ? 'rgba(40, 215, 229, 0.12)' : 'transparent',
              color: activeTab === 'dashboard' ? '#28D7E5' : '#94A3B8',
              fontWeight: activeTab === 'dashboard' ? 700 : 500,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'submissions' ? 'rgba(40, 215, 229, 0.12)' : 'transparent',
              color: activeTab === 'submissions' ? '#28D7E5' : '#94A3B8',
              fontWeight: activeTab === 'submissions' ? 700 : 500,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Inbox size={18} />
              <span>Orçamentos</span>
            </div>
            {stats.novas > 0 && (
              <span
                style={{
                  backgroundColor: '#28D7E5',
                  color: '#080B14',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                {stats.novas}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'projects' ? 'rgba(40, 215, 229, 0.12)' : 'transparent',
              color: activeTab === 'projects' ? '#28D7E5' : '#94A3B8',
              fontWeight: activeTab === 'projects' ? 700 : 500,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <Briefcase size={18} />
            <span>Projetos ({projectsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'settings' ? 'rgba(40, 215, 229, 0.12)' : 'transparent',
              color: activeTab === 'settings' ? '#28D7E5' : '#94A3B8',
              fontWeight: activeTab === 'settings' ? 700 : 500,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <Settings size={18} />
            <span>Configurações</span>
          </button>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', backgroundColor: '#090D1A' }}>
          {/* ================= TAB: DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
                  Visão Geral &amp; Métricas
                </h1>
                <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
                  Acompanhe os orçamentos recebidos, novos clientes potenciais e o status geral da plataforma.
                </p>
              </div>

              {/* Stats Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '20px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(16, 22, 38, 0.7)',
                    border: '1px solid rgba(41, 50, 71, 0.6)',
                    borderRadius: '16px',
                    padding: '22px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Total de Orçamentos</span>
                    <Inbox size={18} color="#28D7E5" />
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFF' }}>{stats.total}</div>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Solicitações recebidas</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(16, 22, 38, 0.7)',
                    border: '1px solid rgba(40, 215, 229, 0.3)',
                    borderRadius: '16px',
                    padding: '22px',
                    boxShadow: stats.novas > 0 ? '0 0 20px rgba(40, 215, 229, 0.1)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#28D7E5', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Novos Leads</span>
                    <Clock size={18} />
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#28D7E5' }}>{stats.novas}</div>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Aguardando primeiro contato</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(16, 22, 38, 0.7)',
                    border: '1px solid rgba(41, 50, 71, 0.6)',
                    borderRadius: '16px',
                    padding: '22px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Respondidos</span>
                    <CheckCircle size={18} color="#10B981" />
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#10B981' }}>{stats.respondidas}</div>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Contatados com sucesso</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(16, 22, 38, 0.7)',
                    border: '1px solid rgba(41, 50, 71, 0.6)',
                    borderRadius: '16px',
                    padding: '22px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Projetos Ativos</span>
                    <Briefcase size={18} color="#7B4DFF" />
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#7B4DFF' }}>{projectsList.length}</div>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Exibidos no portfólio</span>
                </div>
              </div>

              {/* Solutions Breakdown & Quick Access */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(16, 22, 38, 0.7)',
                    border: '1px solid rgba(41, 50, 71, 0.6)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px', color: '#CBD5E1' }}>
                    Interesse por Tipo de Solução
                  </h3>
                  {Object.entries(stats.solutionsMap).length === 0 ? (
                    <p style={{ color: '#64748B', fontSize: '13px' }}>Nenhum lead registrado ainda.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {Object.entries(stats.solutionsMap).map(([solution, count]) => {
                        const percent = Math.round((count / (stats.total || 1)) * 100);
                        return (
                          <div key={solution}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                              <span style={{ color: '#E2E8F0' }}>{solution}</span>
                              <span style={{ color: '#28D7E5', fontWeight: 700 }}>
                                {count} ({percent}%)
                              </span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${percent}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #28D7E5, #7B4DFF)',
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(16, 22, 38, 0.7)',
                    border: '1px solid rgba(41, 50, 71, 0.6)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#CBD5E1' }}>
                      Últimos Orçamentos Recebidos
                    </h3>
                    <button
                      onClick={() => setActiveTab('submissions')}
                      style={{ background: 'none', border: 'none', color: '#28D7E5', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Ver todos &rarr;
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {submissions.slice(0, 4).map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setActiveTab('submissions');
                        }}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#FFF' }}>{sub.nome}</div>
                          <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                            {sub.empresa || 'Pessoa Física'} • {sub.tipoSolucao}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '10px',
                            backgroundColor:
                              sub.status === 'nova'
                                ? 'rgba(40, 215, 229, 0.15)'
                                : sub.status === 'respondida'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'rgba(255, 255, 255, 0.1)',
                            color:
                              sub.status === 'nova'
                                ? '#28D7E5'
                                : sub.status === 'respondida'
                                ? '#10B981'
                                : '#CBD5E1',
                          }}
                        >
                          {sub.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: SUBMISSIONS ================= */}
          {activeTab === 'submissions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: 700, margin: '0 0 6px' }}>
                    Gestão de Orçamentos &amp; Contatos
                  </h1>
                  <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>
                    {filteredSubmissions.length} registro(s) encontrado(s)
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleExportCSV}
                    style={{
                      background: 'rgba(40, 215, 229, 0.12)',
                      border: '1px solid rgba(40, 215, 229, 0.3)',
                      color: '#28D7E5',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Download size={15} />
                    Exportar CSV
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Deseja recarregar os exemplos iniciais de orçamentos?')) {
                        const reset = resetToSampleSubmissions();
                        setSubmissions(reset);
                      }
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94A3B8',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <RefreshCw size={14} />
                    Exemplos
                  </button>
                </div>
              </div>

              {/* Filters & Search Bar */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input
                    type="text"
                    placeholder="Buscar por nome, e-mail, empresa ou solução..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(16, 22, 38, 0.8)',
                      border: '1px solid rgba(71, 85, 105, 0.4)',
                      borderRadius: '10px',
                      padding: '10px 14px 10px 38px',
                      color: '#FFF',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['all', 'nova', 'lida', 'respondida'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: statusFilter === st ? '#28D7E5' : 'rgba(255, 255, 255, 0.1)',
                        backgroundColor: statusFilter === st ? 'rgba(40, 215, 229, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        color: statusFilter === st ? '#28D7E5' : '#94A3B8',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {st === 'all' ? 'Todas' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submissions Table / Cards */}
              <div
                style={{
                  backgroundColor: 'rgba(16, 22, 38, 0.7)',
                  border: '1px solid rgba(41, 50, 71, 0.6)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                {filteredSubmissions.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                    Nenhum orçamento encontrado para os critérios selecionados.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(255, 255, 255, 0.02)', color: '#94A3B8' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Data / Cliente</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Empresa</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Solução</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((sub) => (
                        <tr
                          key={sub.id}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontWeight: 600, color: '#FFF' }}>{sub.nome}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>
                              {new Date(sub.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#CBD5E1' }}>
                            {sub.empresa || <span style={{ color: '#64748B' }}>—</span>}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(123, 77, 255, 0.15)',
                                color: '#A78BFA',
                                fontSize: '11px',
                                fontWeight: 600,
                              }}
                            >
                              {sub.tipoSolucao}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <select
                              value={sub.status}
                              onChange={(e) => handleStatusChange(sub.id, e.target.value as SubmissionStatus)}
                              style={{
                                backgroundColor: 'rgba(10, 15, 28, 0.9)',
                                border: '1px solid rgba(71, 85, 105, 0.4)',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                color:
                                  sub.status === 'nova'
                                    ? '#28D7E5'
                                    : sub.status === 'respondida'
                                    ? '#10B981'
                                    : '#CBD5E1',
                                fontSize: '12px',
                                fontWeight: 600,
                                outline: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="nova">Nova</option>
                              <option value="lida">Lida</option>
                              <option value="respondida">Respondida</option>
                            </select>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => setSelectedSubmission(sub)}
                                title="Ver detalhes completos"
                                style={{
                                  background: 'rgba(40, 215, 229, 0.1)',
                                  border: '1px solid rgba(40, 215, 229, 0.3)',
                                  color: '#28D7E5',
                                  borderRadius: '6px',
                                  padding: '6px 10px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Eye size={13} />
                                Ver
                              </button>
                              <button
                                onClick={() => handleDeleteSubmission(sub.id)}
                                title="Excluir mensagem"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#F87171',
                                  borderRadius: '6px',
                                  padding: '6px 8px',
                                  cursor: 'pointer',
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Submission Detail Modal */}
              {selectedSubmission && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10000,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                  onClick={() => setSelectedSubmission(null)}
                >
                  <div
                    style={{
                      backgroundColor: '#0F1626',
                      border: '1px solid rgba(40, 215, 229, 0.4)',
                      borderRadius: '16px',
                      padding: '28px',
                      width: '100%',
                      maxWidth: '560px',
                      color: '#FFF',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#28D7E5', fontWeight: 700, textTransform: 'uppercase' }}>
                          Detalhes da Mensagem
                        </span>
                        <h2 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 700 }}>
                          {selectedSubmission.nome}
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedSubmission(null)}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px', fontSize: '13px' }}>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', marginBottom: '2px' }}>Empresa</span>
                        <strong>{selectedSubmission.empresa || 'Não informada'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', marginBottom: '2px' }}>Solução de Interesse</span>
                        <strong style={{ color: '#28D7E5' }}>{selectedSubmission.tipoSolucao}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', marginBottom: '2px' }}>E-mail</span>
                        <a href={`mailto:${selectedSubmission.email}`} style={{ color: '#93C5FD', textDecoration: 'none' }}>
                          {selectedSubmission.email}
                        </a>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', marginBottom: '2px' }}>Telefone / WhatsApp</span>
                        <a
                          href={`https://wa.me/55${selectedSubmission.telefone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#34D399', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Phone size={13} />
                          {selectedSubmission.telefone}
                        </a>
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <span style={{ color: '#64748B', display: 'block', marginBottom: '6px', fontSize: '12px' }}>
                        Descrição do Projeto / Necessidade
                      </span>
                      <div
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          borderRadius: '10px',
                          padding: '14px',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: '#E2E8F0',
                          whiteSpace: 'pre-wrap',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {selectedSubmission.descricao}
                      </div>
                    </div>

                    {/* Quick Response Actions */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <a
                        href={`https://wa.me/55${selectedSubmission.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Olá ${selectedSubmission.nome}, aqui é da Devs From Tomorrow sobre seu orçamento!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          backgroundColor: '#10B981',
                          color: '#042F2E',
                          fontWeight: 700,
                          fontSize: '13px',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <MessageSquare size={16} />
                        Responder via WhatsApp
                      </a>

                      <a
                        href={`mailto:${selectedSubmission.email}?subject=${encodeURIComponent(
                          `[Devs From Tomorrow] Orçamento - ${selectedSubmission.tipoSolucao}`
                        )}`}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          backgroundColor: '#2388FF',
                          color: '#FFF',
                          fontWeight: 700,
                          fontSize: '13px',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Mail size={16} />
                        Enviar E-mail
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: PROJECTS ================= */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: 700, margin: '0 0 6px' }}>
                    Gerenciar Portfólio de Projetos
                  </h1>
                  <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>
                    Adicione ou edite os projetos exibidos na página principal da Devs From Tomorrow.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectModalOpen(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #28D7E5, #2388FF)',
                    border: 'none',
                    color: '#080B14',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={16} />
                  Novo Projeto
                </button>
              </div>

              {/* Projects Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {projectsList.map((project) => (
                  <div
                    key={project.id}
                    style={{
                      backgroundColor: 'rgba(16, 22, 38, 0.7)',
                      border: '1px solid rgba(41, 50, 71, 0.6)',
                      borderRadius: '16px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(40, 215, 229, 0.15)',
                            color: '#28D7E5',
                          }}
                        >
                          {project.category}
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setIsProjectModalOpen(true);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94A3B8',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#F87171',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0 6px', color: '#FFF' }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', margin: '0 0 14px' }}>
                        {project.short_description}
                      </p>

                      {/* Tech Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                        {project.technologies?.map((tech) => (
                          <span
                            key={tech}
                            style={{
                              fontSize: '11px',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              color: '#CBD5E1',
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px', fontSize: '12px', color: '#64748B' }}>
                      ID #{project.id} • Slug: {project.slug}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add/Edit Project Modal */}
              {isProjectModalOpen && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10000,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                  onClick={() => setIsProjectModalOpen(false)}
                >
                  <div
                    style={{
                      backgroundColor: '#0F1626',
                      border: '1px solid rgba(40, 215, 229, 0.4)',
                      borderRadius: '16px',
                      padding: '28px',
                      width: '100%',
                      maxWidth: '540px',
                      color: '#FFF',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 18px' }}>
                      {editingProject ? 'Editar Projeto' : 'Adicionar Novo Projeto'}
                    </h2>

                    <form onSubmit={handleSaveProject}>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                          Título do Projeto
                        </label>
                        <input
                          type="text"
                          name="title"
                          required
                          defaultValue={editingProject?.title || ''}
                          placeholder="Ex: Plataforma de Gestão com IA"
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: 'rgba(10, 15, 28, 0.8)',
                            border: '1px solid rgba(71, 85, 105, 0.5)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#FFF',
                            fontSize: '13px',
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                          Categoria
                        </label>
                        <input
                          type="text"
                          name="category"
                          required
                          defaultValue={editingProject?.category || ''}
                          placeholder="Ex: Chatbot & Automação n8n"
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: 'rgba(10, 15, 28, 0.8)',
                            border: '1px solid rgba(71, 85, 105, 0.5)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#FFF',
                            fontSize: '13px',
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                          Descrição Curta (Card)
                        </label>
                        <input
                          type="text"
                          name="short_description"
                          required
                          defaultValue={editingProject?.short_description || ''}
                          placeholder="Resumo em 1 ou 2 frases"
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: 'rgba(10, 15, 28, 0.8)',
                            border: '1px solid rgba(71, 85, 105, 0.5)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#FFF',
                            fontSize: '13px',
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                          Descrição Completa (Modal de detalhes)
                        </label>
                        <textarea
                          name="description"
                          rows={3}
                          required
                          defaultValue={editingProject?.description || ''}
                          placeholder="Explicação detalhada do projeto e benefícios entregues"
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: 'rgba(10, 15, 28, 0.8)',
                            border: '1px solid rgba(71, 85, 105, 0.5)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#FFF',
                            fontSize: '13px',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                          Tecnologias Utilizadas (separadas por vírgula)
                        </label>
                        <input
                          type="text"
                          name="technologies"
                          defaultValue={editingProject?.technologies?.join(', ') || ''}
                          placeholder="React, TypeScript, Python, n8n, OpenAI"
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: 'rgba(10, 15, 28, 0.8)',
                            border: '1px solid rgba(71, 85, 105, 0.5)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#FFF',
                            fontSize: '13px',
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                        <div>
                          <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                            Link GitHub (opcional)
                          </label>
                          <input
                            type="url"
                            name="github_url"
                            defaultValue={editingProject?.github_url || ''}
                            placeholder="https://github.com/..."
                            style={{
                              width: '100%',
                              boxSizing: 'border-box',
                              backgroundColor: 'rgba(10, 15, 28, 0.8)',
                              border: '1px solid rgba(71, 85, 105, 0.5)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              color: '#FFF',
                              fontSize: '13px',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                            Link do Projeto (opcional)
                          </label>
                          <input
                            type="url"
                            name="project_url"
                            defaultValue={editingProject?.project_url || ''}
                            placeholder="https://..."
                            style={{
                              width: '100%',
                              boxSizing: 'border-box',
                              backgroundColor: 'rgba(10, 15, 28, 0.8)',
                              border: '1px solid rgba(71, 85, 105, 0.5)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              color: '#FFF',
                              fontSize: '13px',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setIsProjectModalOpen(false)}
                          style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            fontSize: '13px',
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          style={{
                            padding: '10px 18px',
                            borderRadius: '8px',
                            backgroundColor: '#28D7E5',
                            border: 'none',
                            color: '#080B14',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '13px',
                          }}
                        >
                          Salvar Projeto
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '720px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: 700, margin: '0 0 6px' }}>
                  Configurações da Plataforma
                </h1>
                <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>
                  Ajuste os dados de contato do site e as credenciais de segurança do administrador.
                </p>
              </div>

              {settingsSavedNotice && (
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#6EE7B7',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Check size={16} />
                  {settingsSavedNotice}
                </div>
              )}

              {/* Company Info Form */}
              {settings && (
                <form
                  onSubmit={handleSaveSettings}
                  style={{
                    backgroundColor: 'rgba(16, 22, 38, 0.7)',
                    border: '1px solid rgba(41, 50, 71, 0.6)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '28px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 18px', color: '#FFF' }}>
                    Informações Gerais &amp; Contatos
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        value={settings.site_name}
                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: 'rgba(10, 15, 28, 0.8)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          color: '#FFF',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                        WhatsApp de Atendimento
                      </label>
                      <input
                        type="text"
                        value={settings.whatsapp || ''}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: 'rgba(10, 15, 28, 0.8)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          color: '#FFF',
                          fontSize: '13px',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                        E-mail de Notificação &amp; Contato
                      </label>
                      <input
                        type="email"
                        value={settings.email || ''}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: 'rgba(10, 15, 28, 0.8)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          color: '#FFF',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                        Instagram Oficial
                      </label>
                      <input
                        type="url"
                        value={settings.instagram || ''}
                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: 'rgba(10, 15, 28, 0.8)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          color: '#FFF',
                          fontSize: '13px',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#28D7E5',
                      border: 'none',
                      color: '#080B14',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Save size={15} />
                    Salvar Alterações
                  </button>
                </form>
              )}

              {/* Password Change Form */}
              <form
                onSubmit={handleChangePassword}
                style={{
                  backgroundColor: 'rgba(16, 22, 38, 0.7)',
                  border: '1px solid rgba(41, 50, 71, 0.6)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                  <Key size={18} color="#28D7E5" />
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFF' }}>
                    Segurança: Alterar Senha de Acesso
                  </h3>
                </div>

                {passNotice && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      fontSize: '13px',
                      backgroundColor: passNotice.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${passNotice.type === 'success' ? '#10B981' : '#EF4444'}`,
                      color: passNotice.type === 'success' ? '#6EE7B7' : '#FCA5A5',
                    }}
                  >
                    {passNotice.text}
                  </div>
                )}

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••••••"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(10, 15, 28, 0.8)',
                      border: '1px solid rgba(71, 85, 105, 0.5)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#FFF',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: 'rgba(10, 15, 28, 0.8)',
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: '#FFF',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Repita a nova senha"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: 'rgba(10, 15, 28, 0.8)',
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: '#FFF',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(40, 215, 229, 0.15)',
                    border: '1px solid rgba(40, 215, 229, 0.4)',
                    color: '#28D7E5',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Atualizar Senha
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
