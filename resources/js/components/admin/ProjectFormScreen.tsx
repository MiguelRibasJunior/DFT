import { useState } from 'react'
import { Btn, C, Card, Icon, Input, Page, type Screen, Select, Textarea, Toast, Toggle } from './shared'

// ─────────────────────────────────────────────
// SCREEN: PROJECT FORM
// ─────────────────────────────────────────────
export function ProjectFormScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [toast, setToast] = useState<{ msg: string; v: 'success' | 'error' | 'info' } | null>(null)
  const [activeTab, setActiveTab] = useState('info')
  const [form, setForm] = useState({
    title: '', slug: '', shortDesc: '', fullDesc: '', category: 'web',
    status: 'draft', featured: false, order: '1', externalUrl: '', projectUrl: '', githubUrl: '',
    metaTitle: '', metaDesc: '',
  })

  const f = (k: keyof typeof form) => (v: string | boolean) => setForm(prev => ({ ...prev, [k]: v }))

  const tabs = [
    { key: 'info', label: 'Informações' },
    { key: 'media', label: 'Mídia' },
    { key: 'config', label: 'Configurações' },
    { key: 'seo', label: 'SEO' },
  ]

  return (
    <Page
      title="Novo Projeto"
      breadcrumbs={[{ label: 'Admin' }, { label: 'Projetos' }, { label: 'Novo Projeto' }]}
      onNav={onNav}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" onClick={() => onNav('projects')}>Cancelar</Btn>
          <Btn variant="ghost" onClick={() => setToast({ msg: 'Rascunho salvo!', v: 'info' })}>Salvar rascunho</Btn>
          <Btn onClick={() => setToast({ msg: 'Projeto publicado com sucesso!', v: 'success' })}>Publicar</Btn>
        </div>
      }
    >
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: "'Sora', sans-serif",
            color: activeTab === t.key ? C.blue : C.gray,
            borderBottom: `2px solid ${activeTab === t.key ? C.blue : 'transparent'}`,
            marginBottom: -1, transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Informações Principais</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="Título do Projeto" placeholder="Ex: Portal SaaS FinTech" value={form.title} onChange={f('title')} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="Slug" placeholder="portal-saas-fintech" value={form.slug} onChange={f('slug')}
                  hint="Identificador único na URL" />
                <Select label="Categoria" value={form.category} onChange={f('category')}
                  options={[
                    { value: 'web', label: 'Web App' },
                    { value: 'mobile', label: 'Mobile' },
                    { value: 'automation', label: 'Automação' },
                    { value: 'ecommerce', label: 'E-commerce' },
                    { value: 'system', label: 'Sistema' },
                  ]} />
              </div>
              <Input label="Descrição Curta" placeholder="Resumo em até 160 caracteres" value={form.shortDesc} onChange={f('shortDesc')} />
              <Textarea label="Descrição Completa" placeholder="Descreva o projeto em detalhes..." value={form.fullDesc} onChange={f('fullDesc')} rows={5} />
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'media' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Imagem de Capa</div>
            <div style={{
              border: `2px dashed ${C.border}`, borderRadius: 10, padding: 32,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              cursor: 'pointer', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.blue)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              <div style={{ color: C.gray }}><Icon.Upload /></div>
              <div style={{ fontSize: 13, color: C.gray, fontFamily: "'Manrope', sans-serif", textAlign: 'center' }}>
                Arraste uma imagem ou <span style={{ color: C.blue }}>clique para selecionar</span>
              </div>
              <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>PNG, JPG ou WebP — máx. 5MB</div>
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Galeria</div>
            <div style={{
              border: `2px dashed ${C.border}`, borderRadius: 10, padding: 32,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer',
            }}>
              <div style={{ color: C.gray }}><Icon.Upload /></div>
              <div style={{ fontSize: 13, color: C.gray, fontFamily: "'Manrope', sans-serif", textAlign: 'center' }}>
                Adicionar imagens à galeria
              </div>
              <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>Múltiplos arquivos permitidos</div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'config' && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Configurações</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Select label="Status" value={form.status} onChange={f('status')}
              options={[
                { value: 'draft', label: 'Rascunho' },
                { value: 'published', label: 'Publicado' },
                { value: 'archived', label: 'Arquivado' },
              ]} />
            <Input label="Ordem de Exibição" type="number" value={form.order} onChange={f('order')} />
            <Input label="URL do Projeto" placeholder="https://..." value={form.projectUrl} onChange={f('projectUrl')} />
            <Input label="URL Externa" placeholder="https://..." value={form.externalUrl} onChange={f('externalUrl')} />
            <Input label="GitHub" placeholder="https://github.com/..." value={form.githubUrl} onChange={f('githubUrl')} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 22 }}>
              <Toggle checked={form.featured} onChange={v => setForm(p => ({ ...p, featured: v }))} label="Projeto em Destaque" />
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'seo' && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>SEO</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Meta Title" placeholder="Título para mecanismos de busca" value={form.metaTitle} onChange={f('metaTitle')} />
            <Textarea label="Meta Description" placeholder="Descrição para mecanismos de busca (máx. 160 caracteres)" value={form.metaDesc} onChange={f('metaDesc')} rows={3} />
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif", display: 'block', marginBottom: 6 }}>Imagem Open Graph</label>
              <div style={{
                border: `2px dashed ${C.border}`, borderRadius: 10, padding: 24,
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              }}>
                <Icon.Upload />
                <span style={{ fontSize: 13, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>Upload da imagem OG (1200×630px)</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {toast && <Toast message={toast.msg} variant={toast.v} onClose={() => setToast(null)} />}
    </Page>
  )
}

