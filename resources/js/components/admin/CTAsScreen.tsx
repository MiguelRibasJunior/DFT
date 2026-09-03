import { useState } from 'react'
import { Badge, Btn, C, Card, Icon, Input, Modal, Page, type Screen, Toast, Toggle } from './shared'

// ─────────────────────────────────────────────
// SCREEN: CTAs
// ─────────────────────────────────────────────
const CTAS_DATA = [
  { id: 1, name: 'Hero Principal', title: 'Transforme sua empresa com IA', subtitle: 'Automação inteligente para escalar resultados', btnText: 'Fale com a gente', btnUrl: '#contato', position: 'Hero', active: true, order: 1 },
  { id: 2, name: 'CTA Meio de Página', title: 'Pronto para começar?', subtitle: 'Vamos construir algo incrível juntos', btnText: 'Iniciar projeto', btnUrl: '#contato', position: 'Seção CTA', active: true, order: 2 },
  { id: 3, name: 'CTA Rodapé', title: 'Fale com nossos especialistas', subtitle: '', btnText: 'Entre em contato', btnUrl: '#contato', position: 'Footer', active: false, order: 3 },
]

export function CTAsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [ctas, setCtas] = useState(CTAS_DATA)
  const [toast, setToast] = useState<{ msg: string; v: 'success' | 'error' | 'info' } | null>(null)
  const [editModal, setEditModal] = useState<typeof CTAS_DATA[0] | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  return (
    <Page title="CTAs" breadcrumbs={[{ label: 'Admin' }, { label: 'CTAs' }]} onNav={onNav}
      actions={<Btn icon={<Icon.Plus />} onClick={() => setEditModal({ id: 0, name: '', title: '', subtitle: '', btnText: '', btnUrl: '', position: '', active: true, order: ctas.length + 1 })}>Novo CTA</Btn>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ctas.map(cta => (
          <Card key={cta.id}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              {/* Preview */}
              <div style={{
                flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: '20px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 6 }}>{cta.title || 'Título do CTA'}</div>
                {cta.subtitle && <div style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif", marginBottom: 14 }}>{cta.subtitle}</div>}
                <button style={{ padding: '8px 20px', background: C.blue, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#fff', fontFamily: "'Sora', sans-serif", cursor: 'default' }}>
                  {cta.btnText || 'Botão'}
                </button>
              </div>

              {/* Meta */}
              <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>{cta.name}</span>
                  <Badge variant={cta.active ? 'green' : 'gray'}>{cta.active ? 'Ativo' : 'Inativo'}</Badge>
                </div>
                <div style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>
                  Posição: <span style={{ color: C.white }}>{cta.position}</span>
                </div>
                <div style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>
                  Ordem: <span style={{ color: C.white }}>#{cta.order}</span>
                </div>
                <Toggle checked={cta.active}
                  onChange={v => {
                    setCtas(p => p.map(c => c.id === cta.id ? { ...c, active: v } : c))
                    setToast({ msg: v ? 'CTA ativado!' : 'CTA desativado.', v: 'info' })
                  }}
                  label={cta.active ? 'Ativo' : 'Inativo'} />
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <Btn variant="secondary" size="sm" onClick={() => setEditModal(cta)} icon={<Icon.Edit />}>Editar</Btn>
                  <Btn variant="danger" size="sm" onClick={() => setDeleteId(cta.id)} icon={<Icon.Trash />}>Excluir</Btn>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Excluir CTA?" danger>
        <p style={{ fontSize: 14, color: C.gray, fontFamily: "'Manrope', sans-serif", margin: '0 0 20px' }}>Esta ação não poderá ser desfeita.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="secondary" onClick={() => setDeleteId(null)}>Cancelar</Btn>
          <Btn variant="danger" onClick={() => { setCtas(p => p.filter(c => c.id !== deleteId)); setDeleteId(null); setToast({ msg: 'CTA excluído.', v: 'error' }) }}>Excluir</Btn>
        </div>
      </Modal>

      <Modal open={editModal !== null} onClose={() => setEditModal(null)} title={editModal?.id ? 'Editar CTA' : 'Novo CTA'}>
        {editModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Nome interno" value={editModal.name} onChange={v => setEditModal({ ...editModal, name: v })} />
            <Input label="Título" value={editModal.title} onChange={v => setEditModal({ ...editModal, title: v })} />
            <Input label="Subtítulo" value={editModal.subtitle} onChange={v => setEditModal({ ...editModal, subtitle: v })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="Texto do botão" value={editModal.btnText} onChange={v => setEditModal({ ...editModal, btnText: v })} />
              <Input label="URL do botão" value={editModal.btnUrl} onChange={v => setEditModal({ ...editModal, btnUrl: v })} />
            </div>
            <Input label="Posição no site" value={editModal.position} onChange={v => setEditModal({ ...editModal, position: v })} />
            <Toggle checked={editModal.active} onChange={v => setEditModal({ ...editModal, active: v })} label={editModal.active ? 'Ativo' : 'Inativo'} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
              <Btn variant="secondary" onClick={() => setEditModal(null)}>Cancelar</Btn>
              <Btn onClick={() => {
                setCtas(p => {
                  const exists = p.some(c => c.id === editModal.id)
                  if (exists) return p.map(c => c.id === editModal.id ? editModal : c)
                  return [...p, { ...editModal, id: Math.max(0, ...p.map(c => c.id)) + 1 }]
                })
                setEditModal(null)
                setToast({ msg: 'CTA salvo com sucesso!', v: 'success' })
              }}>Salvar</Btn>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.msg} variant={toast.v} onClose={() => setToast(null)} />}
    </Page>
  )
}

