import { useState, useEffect } from 'react'
import { C, Icon, type Screen } from './shared'
import { LoginScreen } from './LoginScreen'
import { DashboardScreen } from './DashboardScreen'
import { ProjectsScreen } from './ProjectsScreen'
import { ProjectFormScreen } from './ProjectFormScreen'
import { ContactsScreen } from './ContactsScreen'
import { MessagesScreen } from './MessagesScreen'

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [screen, setScreen] = useState<Screen>('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (isOpen && sessionStorage.getItem('dft_admin_authenticated') === 'true') {
      setIsLoggedIn(true)
      setScreen('dashboard')
    }
  }, [isOpen])

  if (!isOpen) return null

  const navigate = (s: Screen) => {
    if (s === 'login') {
      sessionStorage.removeItem('dft_admin_authenticated')
      sessionStorage.removeItem('dft_admin_token')
      setIsLoggedIn(false)
      setScreen('login')
      onClose()
      return
    }
    setScreen(s)
  }

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

      {!isLoggedIn || screen === 'login' ? (
        <LoginScreen onLogin={() => { setIsLoggedIn(true); setScreen('dashboard') }} />
      ) : (
        <>
          {screen === 'dashboard' && <DashboardScreen onNav={navigate} />}
          {screen === 'projects' && <ProjectsScreen onNav={navigate} />}
          {screen === 'project-form' && <ProjectFormScreen onNav={navigate} />}
          {screen === 'contacts' && <ContactsScreen onNav={navigate} />}
          {screen === 'messages' && <MessagesScreen onNav={navigate} />}
        </>
      )}
    </div>
  )
}
