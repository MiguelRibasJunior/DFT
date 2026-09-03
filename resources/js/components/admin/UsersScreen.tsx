import { useState } from 'react'
import { Badge, type BadgeVariant, Btn, C, Card, Icon, Modal, Page, type Screen, Toast, btnIcon } from './shared'

// ─────────────────────────────────────────────
// SCREEN: USERS
// ─────────────────────────────────────────────
const USERS_DATA = [
  { id: 1, name: 'Carlos Admin', email: 'carlos@devsfromtomorrow.com.br', role: 'super', status: 'active', lastAccess: '02/09/2026 às 14:32' },
  { id: 2, name: 'Juliana Editora', email: 'juliana@devsfromtomorrow.com.br', role: 'editor', status: 'active', lastAccess: '01/09/2026 às 09:15' },
  { id: 3, name: 'Marcos Dev', email: 'marcos@devsfromtomorrow.com.br', role: 'admin', status: 'active', lastAccess: '28/08/2026 às 17:00' },
  { id: 4, name: 'Patrícia Marketing', email: 'patricia@devsfromtomorrow.com.br', role: 'editor', status: 'inactive', lastAccess: '10/07/2026 às 11:00' },
]

type UserRole = 'super' | 'admin' | 'editor'

export function UsersScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; v: 'success' | 'error' | 'info' } | null>(null)

  const roleMap: Record<UserRole, { label: string; v: BadgeVariant }> = {
    super: { label: 'Super Admin', v: 'purple' },
    admin: { label: 'Admin', v: 'blue' },
    editor: { label: 'Editor', v: 'cyan' },
  }

  return (
    <Page title="Usuários e Permissões" breadcrumbs={[{ label: 'Admin' }, { label: 'Usuários' }]} onNav={onNav}
      actions={<Btn icon={<Icon.Plus />}>Novo Usuário</Btn>}>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Usuário', 'E-mail', 'Perfil', 'Status', 'Último Acesso', 'Ações'].map(h => (
                <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: C.gray, fontFamily: "'Sora', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USERS_DATA.map((u, i) => (
              <tr key={u.id}
                style={{ borderBottom: i < USERS_DATA.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: "'Sora', sans-serif", flexShrink: 0,
                    }}>{u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif" }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{u.email}</span></td>
                <td style={{ padding: '14px 16px' }}><Badge variant={roleMap[u.role as UserRole].v}>{roleMap[u.role as UserRole].label}</Badge></td>
                <td style={{ padding: '14px 16px' }}><Badge variant={u.status === 'active' ? 'green' : 'gray'}>{u.status === 'active' ? 'Ativo' : 'Inativo'}</Badge></td>
                <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{u.lastAccess}</span></td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button title="Editar" style={{ ...btnIcon, color: C.gray }}><Icon.Edit /></button>
                    <button title="Redefinir senha" style={{ ...btnIcon, color: C.gray }}><Icon.Lock /></button>
                    <button title="Excluir" onClick={() => setDeleteId(u.id)} style={{ ...btnIcon, color: C.red }}><Icon.Trash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Excluir usuário?" danger>
        <p style={{ fontSize: 14, color: C.gray, fontFamily: "'Manrope', sans-serif", margin: '0 0 20px' }}>
          Esta ação não poderá ser desfeita. O usuário perderá todo o acesso ao sistema.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="secondary" onClick={() => setDeleteId(null)}>Cancelar</Btn>
          <Btn variant="danger" onClick={() => { setDeleteId(null); setToast({ msg: 'Usuário excluído.', v: 'error' }) }}>Excluir usuário</Btn>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} variant={toast.v} onClose={() => setToast(null)} />}
    </Page>
  )
}

