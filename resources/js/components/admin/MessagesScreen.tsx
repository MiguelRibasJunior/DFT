import { useState } from 'react'
import { Btn, C, Icon, Page, type Screen, Toast } from './shared'

// ─────────────────────────────────────────────
// SCREEN: MESSAGES
// ─────────────────────────────────────────────
const MESSAGES_DATA = [
  { id: 1, name: 'Pedro Almeida', email: 'pedro@fintech.com.br', subject: 'Orçamento urgente — sistema ERP', preview: 'Precisamos de uma proposta o quanto antes para apresentar ao conselho...', date: '02/09 14:23', read: false },
  { id: 2, name: 'Carla Santos', email: 'carla@design.studio', subject: 'Parceria em projetos', preview: 'Vi o portfólio de vocês e adorei! Gostaria de conversar sobre possível parceria...', date: '01/09 10:15', read: false },
  { id: 3, name: 'Eduardo Lima', email: 'edu@startup.co', subject: 'Re: Proposta chatbot', preview: 'Ótimo! Aprovamos a proposta. Quando podemos iniciar o projeto?', date: '31/08 16:42', read: false },
  { id: 4, name: 'Fernanda Rocha', email: 'fernanda@moda.com.br', subject: 'Dúvidas sobre e-commerce', preview: 'Preciso saber mais sobre as funcionalidades de marketplace...', date: '30/08 09:30', read: true },
  { id: 5, name: 'Gustavo Neves', email: 'gustavo@consultoria.com', subject: 'Automação de processos internos', preview: 'Estamos procurando automatizar vários processos da nossa consultoria...', date: '29/08 11:00', read: true },
]

export function MessagesScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [selected, setSelected] = useState<typeof MESSAGES_DATA[0] | null>(null)
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState<{ msg: string; v: 'success' | 'error' | 'info' } | null>(null)

  const filtered = MESSAGES_DATA.filter(m => {
    if (filter === 'unread') return !m.read
    if (filter === 'read') return m.read
    return true
  })

  return (
    <Page title="Mensagens" breadcrumbs={[{ label: 'Admin' }, { label: 'Mensagens' }]} onNav={onNav}>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', background: C.bg3, minHeight: 500 }}>
        {/* List */}
        <div style={{ borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[['all', 'Todas'], ['unread', 'Não lidas'], ['read', 'Lidas']].map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)} style={{
                  padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  fontFamily: "'Sora', sans-serif", cursor: 'pointer',
                  background: filter === k ? C.blue : 'transparent',
                  color: filter === k ? '#fff' : C.gray,
                  border: `1px solid ${filter === k ? C.blue : 'transparent'}`,
                }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(m => (
              <div key={m.id}
                onClick={() => setSelected(m)}
                style={{
                  padding: '14px 16px', cursor: 'pointer', transition: 'background 0.15s',
                  borderBottom: `1px solid ${C.border}`,
                  background: selected?.id === m.id ? C.blueDim : 'transparent',
                  borderLeft: `3px solid ${!m.read ? C.blue : 'transparent'}`,
                }}
                onMouseEnter={e => { if (selected?.id !== m.id) e.currentTarget.style.background = C.bg }}
                onMouseLeave={e => { if (selected?.id !== m.id) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: !m.read ? 700 : 500, color: C.white, fontFamily: "'Sora', sans-serif" }}>{m.name}</div>
                  <span style={{ fontSize: 10, color: C.gray, fontFamily: "'Manrope', sans-serif", whiteSpace: 'nowrap' }}>{m.date}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: !m.read ? 600 : 400, color: !m.read ? C.white : C.gray, fontFamily: "'Manrope', sans-serif", marginBottom: 3 }}>{m.subject}</div>
                <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.preview}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        {selected ? (
          <div style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>{selected.subject}</h2>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>
                  <span><strong style={{ color: C.white }}>{selected.name}</strong></span>
                  <span>{selected.email}</span>
                  <span>{selected.date}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn variant="ghost" size="sm" onClick={() => setToast({ msg: 'Marcada como lida.', v: 'info' })}>Marcar como lida</Btn>
                <Btn variant="ghost" size="sm" onClick={() => setToast({ msg: 'Mensagem arquivada.', v: 'info' })}>Arquivar</Btn>
                <Btn variant="danger" size="sm" onClick={() => { setSelected(null); setToast({ msg: 'Mensagem excluída.', v: 'error' }) }}>Excluir</Btn>
              </div>
            </div>
            <div style={{ flex: 1, fontSize: 14, color: C.gray, fontFamily: "'Manrope', sans-serif", lineHeight: 1.7, background: C.bg, padding: 20, borderRadius: 10, border: `1px solid ${C.border}` }}>
              {selected.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.gray, gap: 10 }}>
            <Icon.Mail />
            <div style={{ fontSize: 14, fontFamily: "'Manrope', sans-serif" }}>Selecione uma mensagem</div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.msg} variant={toast.v} onClose={() => setToast(null)} />}
    </Page>
  )
}

