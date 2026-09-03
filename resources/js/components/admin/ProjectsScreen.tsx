import { useState } from 'react'
import { Badge, type BadgeVariant, Btn, C, Card, Icon, Modal, Page, type Screen, Toast, btnIcon } from './shared'

// ─────────────────────────────────────────────
// SCREEN: PROJECTS LIST
// ─────────────────────────────────────────────
const PROJECTS_DATA = [
  { id: 1, name: 'Portal SaaS FinTech', category: 'Web App', status: 'published', featured: true, date: '15/03/2025', updated: '02/09/2026', thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=60&h=60&fit=crop' },
  { id: 2, name: 'Chatbot IA Atendimento', category: 'Automação', status: 'published', featured: true, date: '20/05/2025', updated: '28/08/2026', thumb: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=60&h=60&fit=crop' },
  { id: 3, name: 'E-commerce Moda', category: 'E-commerce', status: 'draft', featured: false, date: '—', updated: '25/08/2026', thumb: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=60&h=60&fit=crop' },
  { id: 4, name: 'Sistema ERP Logística', category: 'Sistema', status: 'archived', featured: false, date: '10/01/2025', updated: '15/06/2026', thumb: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=60&h=60&fit=crop' },
  { id: 5, name: 'App Mobile Saúde', category: 'Mobile', status: 'published', featured: false, date: '05/07/2025', updated: '01/09/2026', thumb: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=60&h=60&fit=crop' },
]

type ProjectStatus = 'published' | 'draft' | 'archived'

export function ProjectsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteModal, setDeleteModal] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; v: 'success' | 'error' | 'info' } | null>(null)
  const [openMenu, setOpenMenu] = useState<number | null>(null)

  const statusMap: Record<ProjectStatus, { label: string; v: BadgeVariant }> = {
    published: { label: 'Publicado', v: 'green' },
    draft: { label: 'Rascunho', v: 'gray' },
    archived: { label: 'Arquivado', v: 'yellow' },
  }

  const filtered = PROJECTS_DATA.filter(p =>
    (filterStatus === 'all' || p.status === filterStatus) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Page
      title="Projetos"
      breadcrumbs={[{ label: 'Admin' }, { label: 'Projetos' }]}
      onNav={onNav}
      actions={<Btn icon={<Icon.Plus />} onClick={() => onNav('project-form')}>Novo Projeto</Btn>}
    >
      {/* Filters */}
      <Card style={{ marginBottom: 16, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.gray, display: 'flex' }}>
              <Icon.Search />
            </span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar projetos..."
              style={{
                width: '100%', boxSizing: 'border-box', padding: '8px 12px 8px 32px',
                background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
                fontSize: 13, color: C.white, fontFamily: "'Manrope', sans-serif", outline: 'none',
              }}
            />
          </div>
          {['all', 'published', 'draft', 'archived'].map(s => (
            <button key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                fontFamily: "'Sora', sans-serif", cursor: 'pointer', transition: 'all 0.15s',
                background: filterStatus === s ? C.blue : C.bg,
                color: filterStatus === s ? '#fff' : C.gray,
                border: `1px solid ${filterStatus === s ? C.blue : C.border}`,
              }}
            >{{ all: 'Todos', published: 'Publicados', draft: 'Rascunhos', archived: 'Arquivados' }[s]}</button>
          ))}
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Projeto', 'Categoria', 'Status', 'Destaque', 'Publicado', 'Atualizado', 'Ações'].map(h => (
                <th key={h} style={{
                  padding: '13px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                  color: C.gray, fontFamily: "'Sora', sans-serif", letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{
                borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={p.thumb} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif" }}>{p.name}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{p.category}</span>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <Badge variant={statusMap[p.status as ProjectStatus].v}>{statusMap[p.status as ProjectStatus].label}</Badge>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <Badge variant={p.featured ? 'cyan' : 'gray'}>{p.featured ? 'Sim' : 'Não'}</Badge>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{p.date}</span>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{p.updated}</span>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button title="Visualizar" style={{ ...btnIcon, color: C.gray }}>
                      <Icon.Eye />
                    </button>
                    <button title="Editar" onClick={() => onNav('project-form')} style={{ ...btnIcon, color: C.gray }}>
                      <Icon.Edit />
                    </button>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                        style={{ ...btnIcon, color: C.gray }}
                      >
                        <Icon.MoreVertical />
                      </button>
                      {openMenu === p.id && (
                        <div style={{
                          position: 'absolute', right: 0, top: '100%', marginTop: 4, zIndex: 10,
                          background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10,
                          padding: 6, minWidth: 160, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }}>
                          {[
                            { label: 'Duplicar', icon: Icon.Copy, action: () => { setToast({ msg: 'Projeto duplicado!', v: 'success' }); setOpenMenu(null) } },
                            { label: 'Publicar', icon: Icon.Globe, action: () => { setToast({ msg: 'Projeto publicado!', v: 'success' }); setOpenMenu(null) } },
                            { label: 'Arquivar', icon: Icon.Archive, action: () => { setToast({ msg: 'Projeto arquivado.', v: 'info' }); setOpenMenu(null) } },
                            { label: 'Excluir', icon: Icon.Trash, danger: true, action: () => { setDeleteModal(p.id); setOpenMenu(null) } },
                          ].map((item, j) => (
                            <button key={j} onClick={item.action} style={{
                              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                              padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer',
                              color: item.danger ? C.red : C.gray, fontSize: 13,
                              fontFamily: "'Manrope', sans-serif", borderRadius: 6, textAlign: 'left',
                            }}>
                              <item.icon /> {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button title="Excluir" onClick={() => setDeleteModal(p.id)} style={{ ...btnIcon, color: C.red }}>
                      <Icon.Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{
          padding: '12px 16px', borderTop: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>
            {filtered.length} de {PROJECTS_DATA.length} projetos
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3].map(n => (
              <button key={n} style={{
                width: 30, height: 30, borderRadius: 6, border: `1px solid ${n === 1 ? C.blue : C.border}`,
                background: n === 1 ? C.blue : 'transparent', color: n === 1 ? '#fff' : C.gray,
                fontSize: 12, cursor: 'pointer', fontFamily: "'Sora', sans-serif",
              }}>{n}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Delete Modal */}
      <Modal open={deleteModal !== null} onClose={() => setDeleteModal(null)} title="Excluir projeto?" danger>
        <p style={{ fontSize: 14, color: C.gray, fontFamily: "'Manrope', sans-serif", margin: '0 0 20px' }}>
          Esta ação não poderá ser desfeita. O projeto será permanentemente removido do sistema.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Btn>
          <Btn variant="danger" onClick={() => { setDeleteModal(null); setToast({ msg: 'Projeto excluído.', v: 'error' }) }}>
            Excluir projeto
          </Btn>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} variant={toast.v} onClose={() => setToast(null)} />}
    </Page>
  )
}
