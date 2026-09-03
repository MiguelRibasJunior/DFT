import { useState, useEffect } from 'react'
import { deleteSubmission, getSubmissions, getSubmissionStats, updateSubmissionStatus } from '../../services/submissionService'
import type { ContactSubmission, SubmissionStatus } from '../../types/contact'
import { Badge, type BadgeVariant, Btn, C, Card, Icon, Page, type Screen, Toast, btnIcon } from './shared'

// ─────────────────────────────────────────────
// SCREEN: CONTACTS
// ─────────────────────────────────────────────
export function ContactsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [selected, setSelected] = useState<ContactSubmission | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [toast, setToast] = useState<{ msg: string; v: 'success' | 'error' | 'info' } | null>(null)

  useEffect(() => { setSubmissions(getSubmissions()) }, [])

  const statusMap: Record<SubmissionStatus, { label: string; v: BadgeVariant }> = {
    nova: { label: 'Novo', v: 'cyan' },
    lida: { label: 'Em Atendimento', v: 'yellow' },
    respondida: { label: 'Respondido', v: 'green' },
  }

  const submissionStats = getSubmissionStats(submissions)
  const stats = [
    { label: 'Total', value: submissionStats.total, color: C.blue },
    { label: 'Novos', value: submissionStats.novas, color: C.cyan },
    { label: 'Em Atendimento', value: submissionStats.lidas, color: C.yellow },
    { label: 'Respondidos', value: submissionStats.respondidas, color: C.green },
  ]

  const handleStatusChange = (id: string, status: SubmissionStatus, msg: string) => {
    const updated = updateSubmissionStatus(id, status)
    setSubmissions(updated)
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev))
    setToast({ msg, v: 'success' })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este contato?')) return
    const updated = deleteSubmission(id)
    setSubmissions(updated)
    if (selected?.id === id) setSelected(null)
    setToast({ msg: 'Contato excluído.', v: 'error' })
  }

  const filtered = submissions.filter(c =>
    (filterStatus === 'all' || c.status === filterStatus) &&
    (c.nome.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Page title="Contatos" breadcrumbs={[{ label: 'Admin' }, { label: 'Contatos' }]} onNav={onNav}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <Card style={{ marginBottom: 16, padding: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.gray, display: 'flex' }}>
              <Icon.Search />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar contatos..."
              style={{ width: '100%', boxSizing: 'border-box', padding: '7px 12px 7px 32px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.white, fontFamily: "'Manrope', sans-serif", outline: 'none' }} />
          </div>
          {['all', 'nova', 'lida', 'respondida'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              fontFamily: "'Sora', sans-serif", cursor: 'pointer', transition: 'all 0.15s',
              background: filterStatus === s ? C.blue : 'transparent',
              color: filterStatus === s ? '#fff' : C.gray,
              border: `1px solid ${filterStatus === s ? C.blue : C.border}`,
            }}>{{ all: 'Todos', nova: 'Novos', lida: 'Atendimento', respondida: 'Respondidos' }[s]}</button>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 16, transition: 'all 0.3s' }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Nome', 'E-mail', 'Assunto', 'Status', 'Data', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: C.gray, fontFamily: "'Sora', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id}
                  onClick={() => setSelected(c)}
                  style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', background: selected?.id === c.id ? C.blueDim : 'transparent', transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background = C.bg }}
                  onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif" }}>{c.nome}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{c.email}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif", maxWidth: 160, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.tipoSolucao}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={statusMap[c.status].v}>{statusMap[c.status].label}</Badge>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={(e) => { e.stopPropagation(); setSelected(c) }} style={{ ...btnIcon, color: C.gray }}><Icon.Eye /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id) }} style={{ ...btnIcon, color: C.red }}><Icon.Trash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Detail panel */}
        {selected && (
          <Card style={{ alignSelf: 'start', position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>Detalhes do Contato</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.gray, display: 'flex' }}>
                <Icon.X />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", marginBottom: 2 }}>Nome</div>
                <div style={{ fontSize: 13, color: C.white, fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>{selected.nome}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", marginBottom: 2 }}>E-mail</div>
                <div style={{ fontSize: 13, color: C.blue, fontFamily: "'Manrope', sans-serif" }}>{selected.email}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", marginBottom: 2 }}>Telefone</div>
                <div style={{ fontSize: 13, color: C.white, fontFamily: "'Manrope', sans-serif" }}>{selected.telefone}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", marginBottom: 2 }}>Solução Solicitada</div>
                <div style={{ fontSize: 13, color: C.white, fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>{selected.tipoSolucao}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", marginBottom: 6 }}>Mensagem</div>
                <div style={{ fontSize: 13, color: C.gray, fontFamily: "'Manrope', sans-serif", lineHeight: 1.6, background: C.bg, padding: '10px 12px', borderRadius: 8 }}>
                  {selected.descricao}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{new Date(selected.createdAt).toLocaleString('pt-BR')}</div>
                <Badge variant={statusMap[selected.status].v}>{statusMap[selected.status].label}</Badge>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <Btn size="sm" fullWidth onClick={() => handleStatusChange(selected.id, 'lida', 'Marcado em atendimento.')}>Marcar em Atendimento</Btn>
              <Btn variant="outline" size="sm" fullWidth onClick={() => handleStatusChange(selected.id, 'respondida', 'Marcado como respondido.')}>Marcar como Respondido</Btn>
              <Btn variant="danger" size="sm" fullWidth onClick={() => handleDelete(selected.id)}>Excluir</Btn>
            </div>
          </Card>
        )}
      </div>

      {toast && <Toast message={toast.msg} variant={toast.v} onClose={() => setToast(null)} />}
    </Page>
  )
}

