import { useState, useEffect } from 'react'
import { C, Icon } from './shared'
import { LoginScreen } from './LoginScreen'

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (isOpen && sessionStorage.getItem('dft_admin_authenticated') === 'true') {
      setIsLoggedIn(true)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', background: C.bg }}>
      <button
        onClick={onClose}
        aria-label="Voltar ao site"
        title="Voltar ao site"
        style={{
          position: 'fixed', top: 14, right: 14, zIndex: 10001,
          width: 34, height: 34, borderRadius: '50%',
          background: C.bg3, border: `1px solid ${C.border}`,
          color: C.gray, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon.X />
      </button>

      {!isLoggedIn && <LoginScreen onLogin={() => setIsLoggedIn(true)} />}
    </div>
  )
}
