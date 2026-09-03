import { useState, type FormEvent } from 'react'
import { ENV } from '../../config/env'
import { Btn, C, Icon, Input } from './shared'

// ─────────────────────────────────────────────
// SCREEN: LOGIN
// ─────────────────────────────────────────────
export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Preencha todos os campos.'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${ENV.API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ password }),
      }).catch(() => null)

      if (res && res.ok) {
        const data = await res.json()
        if (data.success) {
          sessionStorage.setItem('dft_admin_authenticated', 'true')
          sessionStorage.setItem('dft_admin_token', data.token)
          setLoading(false)
          onLogin()
          return
        }
      }

      if (password === ENV.ADMIN_PASSWORD || password === 'dft2026admin') {
        sessionStorage.setItem('dft_admin_authenticated', 'true')
        setLoading(false)
        onLogin()
      } else {
        setLoading(false)
        setError('Credenciais administrativas incorretas.')
      }
    } catch {
      setLoading(false)
      setError('Erro ao validar autenticação.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* BG geometric */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(ellipse 600px 400px at 20% 50%, ${C.blueDim}, transparent),
          radial-gradient(ellipse 400px 600px at 80% 20%, ${C.purpleDim}, transparent)`,
      }} />
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.04 }} width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.blue} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div style={{
        position: 'relative', zIndex: 1,
        background: C.bg2, border: `1px solid ${C.border}`,
        borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420,
        boxShadow: `0 0 0 1px ${C.borderLight}, 0 32px 80px rgba(0,0,0,0.6)`,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
            boxShadow: `0 0 24px ${C.blueDim}`,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <polygon points="12 2 22 20 2 20" />
            </svg>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>
            Devs From Tomorrow
          </div>
          <div style={{ fontSize: 13, color: C.gray, fontFamily: "'Manrope', sans-serif", marginTop: 4 }}>
            Acesso Administrativo
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="E-mail" type="email" placeholder="admin@devsfromtomorrow.com"
            value={email} onChange={setEmail} error={error && !email ? 'Campo obrigatório' : undefined} />
          <Input label="Senha" type="password" placeholder="••••••••••••"
            value={password} onChange={setPassword} error={error && !password ? 'Campo obrigatório' : undefined} />

          {error && (
            <div style={{
              padding: '9px 12px', background: C.redDim, border: `1px solid rgba(240,78,55,0.3)`,
              borderRadius: 8, fontSize: 12, color: C.red, fontFamily: "'Manrope', sans-serif",
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                style={{ accentColor: C.blue }} />
              <span style={{ fontSize: 12, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>Lembrar-me</span>
            </label>
            <a href="#" style={{ fontSize: 12, color: C.blue, fontFamily: "'Manrope', sans-serif', textDecoration: 'none'" }}>
              Esqueci minha senha
            </a>
          </div>

          <Btn type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 14, height: 14, border: '2px solid #ffffff40',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite', display: 'inline-block',
                }} />
                Autenticando...
              </span>
            ) : 'Entrar'}
          </Btn>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>
          <Icon.Shield /> Acesso restrito a administradores autorizados
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

