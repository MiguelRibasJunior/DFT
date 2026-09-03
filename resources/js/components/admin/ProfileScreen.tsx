import { useState } from 'react'
import { Badge, Btn, C, Card, Icon, Input, Page, type Screen, Toast } from './shared'

// ─────────────────────────────────────────────
// SCREEN: PROFILE
// ─────────────────────────────────────────────
export function ProfileScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [toast, setToast] = useState<{ msg: string; v: 'success' | 'error' | 'info' } | null>(null)

  return (
    <Page title="Meu Perfil" breadcrumbs={[{ label: 'Admin' }, { label: 'Perfil' }]} onNav={onNav}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
        {/* Avatar card */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 28, gap: 14, textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: "'Sora', sans-serif",
            border: `3px solid ${C.border}`,
          }}>CA</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>Carlos Admin</div>
            <div style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif", marginTop: 2 }}>carlos@devsfromtomorrow.com.br</div>
          </div>
          <Badge variant="purple">Super Admin</Badge>
          <Btn variant="secondary" size="sm" fullWidth icon={<Icon.Upload />}>Trocar foto</Btn>

          <div style={{ width: '100%', paddingTop: 14, borderTop: `1px solid ${C.border}`, textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", marginBottom: 6 }}>Sessão atual</div>
            <div style={{ fontSize: 12, color: C.white, fontFamily: "'Manrope', sans-serif" }}>02/09/2026 às 14:32</div>
            <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", marginTop: 2 }}>São Paulo, Brasil</div>
          </div>
          <Btn variant="danger" size="sm" fullWidth icon={<Icon.Logout />} onClick={() => onNav('login')}>Encerrar sessão</Btn>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Dados Pessoais</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="Nome completo" value="Carlos Admin" />
              <Input label="E-mail" type="email" value="carlos@devsfromtomorrow.com.br" />
            </div>
            <div style={{ marginTop: 14 }}>
              <Btn onClick={() => setToast({ msg: 'Dados atualizados!', v: 'success' })}>Salvar alterações</Btn>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Segurança</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="Senha atual" type="password" placeholder="••••••••" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="Nova senha" type="password" placeholder="••••••••" hint="Mínimo 8 caracteres" />
                <Input label="Confirmar nova senha" type="password" placeholder="••••••••" />
              </div>
              <div>
                <Btn variant="outline" onClick={() => setToast({ msg: 'Senha atualizada com sucesso!', v: 'success' })}>Atualizar senha</Btn>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {toast && <Toast message={toast.msg} variant={toast.v} onClose={() => setToast(null)} />}
    </Page>
  )
}

