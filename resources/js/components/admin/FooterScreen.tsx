import { useState } from 'react'
import { Btn, C, Card, Input, Page, type Screen, Textarea, Toast } from './shared'

// ─────────────────────────────────────────────
// SCREEN: FOOTER
// ─────────────────────────────────────────────
export function FooterScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [toast, setToast] = useState<{ msg: string; v: 'success' | 'error' | 'info' } | null>(null)
  const [form, setForm] = useState({
    company: 'Devs From Tomorrow', description: 'Especialistas em automação com IA, chatbots e desenvolvimento de sistemas.',
    address: 'São Paulo, SP — Brasil', phone: '+55 (11) 91234-5678', whatsapp: '+55 (11) 91234-5678',
    email: 'contato@devsfromtomorrow.com.br',
    instagram: '@devsfromtomorrow', facebook: '', linkedin: '/company/devsfromtomorrow', youtube: '', github: 'github.com/devsfromtomorrow',
    copyright: '© 2026 Devs From Tomorrow. Todos os direitos reservados.',
    privacy: '/politica-de-privacidade', terms: '/termos-de-uso',
  })
  const f = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <Page title="Footer" breadcrumbs={[{ label: 'Admin' }, { label: 'Footer' }]} onNav={onNav}
      actions={<Btn onClick={() => setToast({ msg: 'Footer salvo com sucesso!', v: 'success' })}>Salvar Footer</Btn>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Informações da Empresa</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="Nome da empresa" value={form.company} onChange={f('company')} />
            <Textarea label="Descrição" value={form.description} onChange={f('description')} rows={3} />
            <Input label="Endereço" value={form.address} onChange={f('address')} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="Telefone" value={form.phone} onChange={f('phone')} />
              <Input label="WhatsApp" value={form.whatsapp} onChange={f('whatsapp')} />
            </div>
            <Input label="E-mail" value={form.email} onChange={f('email')} />
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Redes Sociais</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Instagram', 'instagram'], ['Facebook', 'facebook'], ['LinkedIn', 'linkedin'], ['YouTube', 'youtube'], ['GitHub', 'github']].map(([l, k]) => (
              <Input key={k} label={l} value={form[k as keyof typeof form]} onChange={f(k as keyof typeof form)} placeholder={`URL do ${l}`} />
            ))}
          </div>
        </Card>

        <Card style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Campos Adicionais</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Input label="Copyright" value={form.copyright} onChange={f('copyright')} />
            <Input label="Política de Privacidade (URL)" value={form.privacy} onChange={f('privacy')} />
            <Input label="Termos de Uso (URL)" value={form.terms} onChange={f('terms')} />
          </div>
        </Card>

        {/* Preview */}
        <Card style={{ gridColumn: '1 / -1', background: '#050709' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.gray, fontFamily: "'Sora', sans-serif", marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview do Footer</div>
          <div style={{ background: C.bg2, borderRadius: 10, padding: '28px 32px', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 32, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 8 }}>{form.company}</div>
                <div style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif", lineHeight: 1.6 }}>{form.description}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contato</div>
                {[form.email, form.phone].filter(Boolean).map((v, i) => (
                  <div key={i} style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", marginBottom: 4 }}>{v}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Redes</div>
                {[form.instagram, form.linkedin, form.github].filter(Boolean).map((v, i) => (
                  <div key={i} style={{ fontSize: 11, color: C.blue, fontFamily: "'Manrope', sans-serif", marginBottom: 4 }}>{v}</div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{form.copyright}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[form.privacy && 'Privacidade', form.terms && 'Termos'].filter(Boolean).map((v, i) => (
                  <span key={i} style={{ fontSize: 11, color: C.blue, fontFamily: "'Manrope', sans-serif", cursor: 'pointer' }}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {toast && <Toast message={toast.msg} variant={toast.v} onClose={() => setToast(null)} />}
    </Page>
  )
}

