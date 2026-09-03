import { useState } from 'react'
import { Btn, C, Card, Icon, Input, Page, type Screen, Textarea, Toast } from './shared'

// ─────────────────────────────────────────────
// SCREEN: SETTINGS
// ─────────────────────────────────────────────
export function SettingsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [tab, setTab] = useState('general')
  const [toast, setToast] = useState<{ msg: string; v: 'success' | 'error' | 'info' } | null>(null)

  const tabs = [
    { key: 'general', label: 'Geral' },
    { key: 'contact', label: 'Contato' },
    { key: 'social', label: 'Redes Sociais' },
    { key: 'seo', label: 'SEO' },
    { key: 'integrations', label: 'Integrações' },
  ]

  return (
    <Page title="Configurações" breadcrumbs={[{ label: 'Admin' }, { label: 'Configurações' }]} onNav={onNav}
      actions={<Btn onClick={() => setToast({ msg: 'Configurações atualizadas com sucesso!', v: 'success' })}>Salvar configurações</Btn>}>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Sidebar tabs */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <Card style={{ padding: 8 }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 12px', background: tab === t.key ? C.blueDim : 'transparent',
                border: 'none', borderRadius: 7, cursor: 'pointer',
                fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
                color: tab === t.key ? C.blue : C.gray,
                fontFamily: "'Manrope', sans-serif", marginBottom: 2,
              }}>{t.label}</button>
            ))}
          </Card>
        </div>

        <div style={{ flex: 1 }}>
          {tab === 'general' && (
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Configurações Gerais</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input label="Nome do Site" placeholder="Devs From Tomorrow" />
                <Textarea label="Descrição" placeholder="Especialistas em automação com IA..." rows={3} />
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif", display: 'block', marginBottom: 6 }}>Logo</label>
                  <div style={{ border: `2px dashed ${C.border}`, borderRadius: 8, padding: 20, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <Icon.Upload /><span style={{ fontSize: 13, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>Upload do logo (SVG ou PNG)</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif", display: 'block', marginBottom: 6 }}>Favicon</label>
                  <div style={{ border: `2px dashed ${C.border}`, borderRadius: 8, padding: 20, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <Icon.Upload /><span style={{ fontSize: 13, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>Upload do favicon (ICO ou PNG 32×32)</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {tab === 'contact' && (
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Informações de Contato</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="Telefone" placeholder="+55 (11) 9 1234-5678" />
                <Input label="WhatsApp" placeholder="+55 (11) 9 1234-5678" />
                <Input label="E-mail" type="email" placeholder="contato@devsfromtomorrow.com.br" />
                <Input label="Endereço" placeholder="São Paulo, SP — Brasil" />
              </div>
            </Card>
          )}

          {tab === 'social' && (
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Redes Sociais</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['Instagram', 'https://instagram.com/devsfromtomorrow'], ['Facebook', ''], ['LinkedIn', 'https://linkedin.com/company/devsfromtomorrow'], ['YouTube', ''], ['GitHub', 'https://github.com/devsfromtomorrow']].map(([l, v]) => (
                  <Input key={l} label={l} placeholder={`URL do ${l}`} value={v} />
                ))}
              </div>
            </Card>
          )}

          {tab === 'seo' && (
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Configurações de SEO</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input label="Título Padrão" placeholder="Devs From Tomorrow — Automação com IA" />
                <Textarea label="Meta Description" placeholder="Somos especialistas em chatbots, automação com IA e desenvolvimento de sistemas..." rows={3} />
                <Input label="Palavras-chave" placeholder="automação ia, chatbot, desenvolvimento web, sistemas" hint="Separe com vírgulas" />
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif", display: 'block', marginBottom: 6 }}>Imagem Open Graph</label>
                  <div style={{ border: `2px dashed ${C.border}`, borderRadius: 8, padding: 20, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <Icon.Upload /><span style={{ fontSize: 13, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>1200×630px — PNG ou JPG</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {tab === 'integrations' && (
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Integrações</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { label: 'Google Analytics', key: 'GA_MEASUREMENT_ID', placeholder: 'G-XXXXXXXXXX' },
                  { label: 'Google Tag Manager', key: 'GTM_ID', placeholder: 'GTM-XXXXXXX' },
                ].map(int => (
                  <div key={int.key} style={{ padding: 16, background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 10 }}>{int.label}</div>
                    <Input label={`ID — ${int.key}`} placeholder={int.placeholder} />
                  </div>
                ))}
                <div style={{ padding: 16, background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 10 }}>Scripts Personalizados</div>
                  <Textarea label="Scripts no &lt;head&gt;" placeholder="<!-- Seu script aqui -->" rows={4} />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.msg} variant={toast.v} onClose={() => setToast(null)} />}
    </Page>
  )
}

