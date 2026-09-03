import { useState, useEffect } from 'react'
import { getSubmissions, getSubmissionStats } from '../../services/submissionService'
import type { ContactSubmission, SubmissionStatus } from '../../types/contact'
import { Badge, type BadgeVariant, BarChart, Btn, C, Card, Icon, LineChart, Page, type Screen } from './shared'

// ─────────────────────────────────────────────
// SCREEN: DASHBOARD
// ─────────────────────────────────────────────
const CONTACTS_CHART = [12, 18, 14, 22, 30, 26, 35, 28, 42, 38, 45, 40]
const PROJECTS_STATUS = [
  { label: 'Jan', value: 3, color: `linear-gradient(180deg, ${C.blue}, ${C.blue}60)` },
  { label: 'Fev', value: 5, color: `linear-gradient(180deg, ${C.blue}, ${C.blue}60)` },
  { label: 'Mar', value: 2, color: `linear-gradient(180deg, ${C.cyan}, ${C.cyan}60)` },
  { label: 'Abr', value: 7, color: `linear-gradient(180deg, ${C.blue}, ${C.blue}60)` },
  { label: 'Mai', value: 4, color: `linear-gradient(180deg, ${C.purple}, ${C.purple}60)` },
  { label: 'Jun', value: 9, color: `linear-gradient(180deg, ${C.cyan}, ${C.cyan}60)` },
  { label: 'Jul', value: 6, color: `linear-gradient(180deg, ${C.blue}, ${C.blue}60)` },
]

export function DashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])

  useEffect(() => {
    setSubmissions(getSubmissions())
  }, [])

  const submissionStats = getSubmissionStats(submissions)

  const stats = [
    { label: 'Total de Projetos', value: 24, desc: '+3 este mês', icon: Icon.Projects, color: C.blue, bg: C.blueDim },
    { label: 'Publicados', value: 18, desc: '75% do total', icon: Icon.Globe, color: C.cyan, bg: C.cyanDim },
    { label: 'Novos Contatos', value: submissionStats.novas, desc: `${submissionStats.total} no total`, icon: Icon.Contacts, color: C.purple, bg: C.purpleDim },
    { label: 'Respondidos', value: submissionStats.respondidas, desc: 'Contatos finalizados', icon: Icon.Messages, color: C.yellow, bg: C.yellowDim },
  ]

  const contactStatusMap: Record<SubmissionStatus, 'new' | 'attending' | 'answered'> = {
    nova: 'new', lida: 'attending', respondida: 'answered',
  }

  const recentContacts = submissions.slice(0, 3).map((s) => ({
    name: s.nome,
    email: s.email,
    subject: s.tipoSolucao,
    date: new Date(s.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    status: contactStatusMap[s.status],
  }))

  const recentProjects = [
    { name: 'Portal SaaS FinTech', category: 'Web App', status: 'published' as const, updated: '2 dias atrás' },
    { name: 'Chatbot IA Atendimento', category: 'Automação', status: 'published' as const, updated: '5 dias atrás' },
    { name: 'E-commerce Moda', category: 'E-commerce', status: 'draft' as const, updated: '1 semana atrás' },
  ]

  const statusMap = {
    new: { label: 'Novo', v: 'cyan' as BadgeVariant },
    attending: { label: 'Atendimento', v: 'yellow' as BadgeVariant },
    answered: { label: 'Respondido', v: 'green' as BadgeVariant },
    published: { label: 'Publicado', v: 'green' as BadgeVariant },
    draft: { label: 'Rascunho', v: 'gray' as BadgeVariant },
  }

  return (
    <Page title="Dashboard" breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]} onNav={onNav}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: s.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color,
              }}>
                <s.icon />
              </div>
              <span style={{ fontSize: 11, color: C.green, fontFamily: "'Manrope', sans-serif", display: 'flex', alignItems: 'center', gap: 3 }}>
                <Icon.TrendUp /> +{i % 2 === 0 ? '12' : '8'}%
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.white, fontFamily: "'Manrope', sans-serif", marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", marginTop: 2 }}>{s.desc}</div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        <Card>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>Contatos Recebidos</div>
            <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>Últimos 12 meses</div>
          </div>
          <LineChart data={CONTACTS_CHART} />
        </Card>
        <Card>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>Projetos por Período</div>
            <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>Publicações mensais 2025</div>
          </div>
          <BarChart data={PROJECTS_STATUS} />
        </Card>
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 12 }}>Atalhos Rápidos</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'Novo Projeto', icon: Icon.Plus, screen: 'project-form' as Screen, color: C.blue },
            { label: 'Ver Mensagens', icon: Icon.Messages, screen: 'messages' as Screen, color: C.cyan },
            { label: 'Ver Contatos', icon: Icon.Contacts, screen: 'contacts' as Screen, color: C.purple },
            { label: 'Configurações', icon: Icon.Settings, screen: 'settings' as Screen, color: C.gray },
          ].map((a, i) => (
            <button
              key={i} onClick={() => onNav(a.screen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', background: C.bg3, border: `1px solid ${C.border}`,
                borderRadius: 8, cursor: 'pointer', color: a.color, fontSize: 13,
                fontFamily: "'Manrope', sans-serif", fontWeight: 600, transition: 'border-color 0.2s',
              }}
            >
              <a.icon /> {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Contacts */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>Últimos Contatos</div>
            <Btn variant="ghost" size="sm" onClick={() => onNav('contacts')}>Ver todos</Btn>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentContacts.map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', background: C.bg, borderRadius: 8,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: "'Sora', sans-serif", flexShrink: 0,
                }}>{c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Badge variant={statusMap[c.status].v}>{statusMap[c.status].label}</Badge>
                  <span style={{ fontSize: 10, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Projects */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>Projetos Recentes</div>
            <Btn variant="ghost" size="sm" onClick={() => onNav('projects')}>Ver todos</Btn>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentProjects.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', background: C.bg, borderRadius: 8,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: C.bg2, border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  color: C.blue,
                }}><Icon.Projects /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{p.category}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Badge variant={statusMap[p.status].v}>{statusMap[p.status].label}</Badge>
                  <span style={{ fontSize: 10, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{p.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  )
}

