import React, { useState, useEffect } from 'react'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export type Screen =
  | 'login'
  | 'dashboard'
  | 'projects'
  | 'project-form'
  | 'contacts'
  | 'messages'
  | 'ctas'
  | 'footer'
  | 'settings'
  | 'users'
  | 'profile'

export type BadgeVariant = 'blue' | 'cyan' | 'purple' | 'green' | 'yellow' | 'red' | 'gray'

// ─────────────────────────────────────────────
// ICONS (inline SVG)
// ─────────────────────────────────────────────
export const Icon = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Projects: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Contacts: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Messages: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  CTAs: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Footer: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Profile: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  MoreVertical: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  TrendUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Globe: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Triangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 22 20 2 20" />
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Archive: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  ),
  ExternalLink: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
}

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
export const C = {
  bg: '#080B14',
  bg2: '#0D1322',
  bg3: '#101524',
  border: '#1E2A3D',
  borderLight: '#293247',
  blue: '#2388FF',
  blueLight: '#4BA3FF',
  blueDim: 'rgba(35,136,255,0.12)',
  cyan: '#28D7E5',
  cyanDim: 'rgba(40,215,229,0.12)',
  purple: '#7B4DFF',
  purpleDim: 'rgba(123,77,255,0.12)',
  green: '#22D18A',
  greenDim: 'rgba(34,209,138,0.12)',
  yellow: '#F5C842',
  yellowDim: 'rgba(245,200,66,0.12)',
  red: '#F04E37',
  redDim: 'rgba(240,78,55,0.12)',
  white: '#F5F7FA',
  gray: '#AAB2C0',
  grayDim: 'rgba(170,178,192,0.08)',
}

// ─────────────────────────────────────────────
// PRIMITIVE COMPONENTS
// ─────────────────────────────────────────────

export function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  const map: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
    blue: { bg: C.blueDim, text: C.blueLight, border: 'rgba(35,136,255,0.25)' },
    cyan: { bg: C.cyanDim, text: C.cyan, border: 'rgba(40,215,229,0.25)' },
    purple: { bg: C.purpleDim, text: '#A07BFF', border: 'rgba(123,77,255,0.25)' },
    green: { bg: C.greenDim, text: C.green, border: 'rgba(34,209,138,0.25)' },
    yellow: { bg: C.yellowDim, text: C.yellow, border: 'rgba(245,200,66,0.25)' },
    red: { bg: C.redDim, text: C.red, border: 'rgba(240,78,55,0.25)' },
    gray: { bg: C.grayDim, text: C.gray, border: 'rgba(170,178,192,0.15)' },
  }
  const s = map[variant]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.03em',
      background: s.bg, color: s.text,
      border: `1px solid ${s.border}`,
      fontFamily: "'Sora', sans-serif",
    }}>
      {children}
    </span>
  )
}

export function Btn({
  children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, fullWidth, icon,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}) {
  const [hov, setHov] = useState(false)
  const styles: Record<string, { bg: string; text: string; border: string; bgHov: string }> = {
    primary: { bg: C.blue, text: '#fff', border: 'transparent', bgHov: C.blueLight },
    secondary: { bg: C.bg3, text: C.white, border: C.borderLight, bgHov: '#1a2438' },
    ghost: { bg: 'transparent', text: C.gray, border: 'transparent', bgHov: C.grayDim },
    danger: { bg: C.redDim, text: C.red, border: 'rgba(240,78,55,0.3)', bgHov: 'rgba(240,78,55,0.2)' },
    outline: { bg: 'transparent', text: C.blue, border: C.blue, bgHov: C.blueDim },
  }
  const s = styles[variant]
  const pad = size === 'sm' ? '5px 12px' : size === 'lg' ? '11px 24px' : '8px 18px'
  const fs = size === 'sm' ? 12 : size === 'lg' ? 15 : 13
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: pad, borderRadius: 8, fontSize: fs, fontWeight: 600,
        fontFamily: "'Sora', sans-serif", cursor: disabled ? 'not-allowed' : 'pointer',
        background: hov ? s.bgHov : s.bg, color: s.text,
        border: `1px solid ${s.border}`,
        transition: 'all 0.18s ease', opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
    </button>
  )
}

export function Input({
  label, type = 'text', placeholder, value, onChange, name, hint, error,
}: {
  label?: string; type?: string; placeholder?: string; value?: string
  onChange?: (v: string) => void; name?: string; hint?: string; error?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif" }}>{label}</label>}
      <input
        type={type} name={name} placeholder={placeholder} value={value}
        onChange={e => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: C.bg2, border: `1px solid ${error ? C.red : focused ? C.blue : C.border}`,
          borderRadius: 8, padding: '9px 13px', fontSize: 13, color: C.white,
          fontFamily: "'Manrope', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box',
          transition: 'border-color 0.18s',
          boxShadow: focused && !error ? `0 0 0 3px ${C.blueDim}` : 'none',
        }}
      />
      {hint && !error && <span style={{ fontSize: 11, color: C.gray }}>{hint}</span>}
      {error && <span style={{ fontSize: 11, color: C.red }}>{error}</span>}
    </div>
  )
}

export function Textarea({ label, placeholder, value, onChange, rows = 4 }: {
  label?: string; placeholder?: string; value?: string; onChange?: (v: string) => void; rows?: number
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif" }}>{label}</label>}
      <textarea
        placeholder={placeholder} value={value} rows={rows}
        onChange={e => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: C.bg2, border: `1px solid ${focused ? C.blue : C.border}`,
          borderRadius: 8, padding: '9px 13px', fontSize: 13, color: C.white,
          fontFamily: "'Manrope', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box',
          resize: 'vertical', transition: 'border-color 0.18s',
          boxShadow: focused ? `0 0 0 3px ${C.blueDim}` : 'none',
        }}
      />
    </div>
  )
}

export function Select({ label, options, value, onChange }: {
  label?: string; options: { value: string; label: string }[]; value?: string; onChange?: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif" }}>{label}</label>}
      <select
        value={value} onChange={e => onChange?.(e.target.value)}
        style={{
          background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '9px 13px', fontSize: 13, color: C.white,
          fontFamily: "'Manrope', sans-serif", outline: 'none', width: '100%', cursor: 'pointer',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value} style={{ background: C.bg2 }}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 99, position: 'relative',
          background: checked ? C.blue : C.border, transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3, width: 16, height: 16,
          borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
        }} />
      </div>
      {label && <span style={{ fontSize: 13, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>{label}</span>}
    </label>
  )
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: 20, ...style,
    }}>
      {children}
    </div>
  )
}

export function Modal({ open, onClose, title, children, danger }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; danger?: boolean
}) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(8,11,20,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.bg2, border: `1px solid ${danger ? 'rgba(240,78,55,0.3)' : C.border}`,
          borderRadius: 16, padding: 28, width: '100%', maxWidth: 440,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.gray, display: 'flex' }}>
            <Icon.X />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Toast({ message, variant, onClose }: { message: string; variant: 'success' | 'error' | 'info'; onClose: () => void }) {
  const colors = { success: C.green, error: C.red, info: C.blue }
  const icons = { success: <Icon.Check />, error: <Icon.X />, info: <Icon.Bell /> }
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
      background: C.bg2, border: `1px solid ${colors[variant]}40`,
      borderRadius: 10, padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${colors[variant]}20`,
      minWidth: 280,
    }}>
      <span style={{ color: colors[variant], display: 'flex' }}>{icons[variant]}</span>
      <span style={{ fontSize: 13, color: C.white, fontFamily: "'Manrope', sans-serif", flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.gray, display: 'flex' }}>
        <Icon.X />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// SIMPLE SVG CHART
// ─────────────────────────────────────────────
export function BarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...data.map(d => d.value))
  const h = 120
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: h + 32 }}>
      {data.map((d, i) => {
        const barH = (d.value / max) * h
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 10, color: C.gray, fontFamily: "'Sora', sans-serif" }}>{d.value}</div>
            <div style={{
              width: '100%', height: barH, borderRadius: '4px 4px 0 0',
              background: d.color || `linear-gradient(180deg, ${C.blue}, ${C.cyan}40)`,
              transition: 'height 0.5s ease',
            }} />
            <div style={{ fontSize: 10, color: C.gray, fontFamily: "'Manrope', sans-serif", textAlign: 'center' }}>{d.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export function LineChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const w = 300, h = 80
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width="100%" height={h + 20} viewBox={`0 0 ${w} ${h + 20}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.cyan} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill="url(#lineGrad)" stroke="none"
      />
      <polyline points={pts} fill="none" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: Icon.Dashboard },
  { key: 'projects', label: 'Projetos', icon: Icon.Projects },
  { key: 'contacts', label: 'Contatos', icon: Icon.Contacts, badge: 3 },
  { key: 'messages', label: 'Mensagens', icon: Icon.Messages, badge: 7 },
  { key: 'ctas', label: 'CTAs', icon: Icon.CTAs },
  { key: 'footer', label: 'Footer', icon: Icon.Footer },
  { key: 'settings', label: 'Configurações', icon: Icon.Settings },
  { key: 'users', label: 'Usuários', icon: Icon.Users },
  { key: 'profile', label: 'Perfil', icon: Icon.Profile },
]

function Sidebar({ current, onNav, collapsed, onCollapse }: {
  current: Screen; onNav: (s: Screen) => void; collapsed: boolean; onCollapse: () => void
}) {
  return (
    <aside style={{
      width: collapsed ? 68 : 256, minHeight: '100vh',
      background: C.bg2,
      borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease',
      flexShrink: 0, position: 'relative', zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '18px 14px' : '18px 22px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden',
      }}>
        <div style={{
          width: 32, height: 32, flexShrink: 0,
          background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon.Triangle />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", lineHeight: 1.2 }}>
              Devs From
            </div>
            <div style={{ fontSize: 11, color: C.cyan, fontFamily: "'Sora', sans-serif", fontWeight: 600, letterSpacing: '0.08em' }}>
              TOMORROW
            </div>
          </div>
        )}
        {!collapsed && (
          <button onClick={onCollapse} style={{
            marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
            color: C.gray, display: 'flex', padding: 4,
          }}>
            <Icon.ChevronRight />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={onCollapse} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.gray, display: 'flex', alignSelf: 'center', padding: '10px 0', marginTop: 4,
        }}>
          <Icon.Menu />
        </button>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => {
          const active = current === item.key
          return (
            <NavItem key={item.key} item={item} active={active} collapsed={collapsed}
              onClick={() => onNav(item.key as Screen)} />
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${C.border}` }}>
        <NavItem
          item={{ key: 'logout', label: 'Sair', icon: Icon.Logout }}
          active={false} collapsed={collapsed}
          onClick={() => onNav('login')}
          danger
        />
      </div>
    </aside>
  )
}

function NavItem({ item, active, collapsed, onClick, danger }: {
  item: { key: string; label: string; icon: () => React.JSX.Element; badge?: number }
  active: boolean; collapsed: boolean; onClick: () => void; danger?: boolean
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      title={collapsed ? item.label : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '9px 14px' : '9px 12px',
        borderRadius: 8, width: '100%', border: 'none', cursor: 'pointer',
        background: active ? C.blueDim : hov ? C.grayDim : 'transparent',
        color: active ? C.blue : danger ? C.red : hov ? C.white : C.gray,
        transition: 'all 0.15s ease', fontFamily: "'Manrope', sans-serif",
        fontSize: 13, fontWeight: active ? 600 : 500,
        borderLeft: active ? `2px solid ${C.blue}` : '2px solid transparent',
        position: 'relative',
      }}
    >
      <span style={{ display: 'flex', flexShrink: 0 }}><item.icon /></span>
      {!collapsed && <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>{item.label}</span>}
      {!collapsed && item.badge && (
        <span style={{
          background: C.blue, color: '#fff', fontSize: 10, fontWeight: 700,
          borderRadius: 99, padding: '1px 6px', fontFamily: "'Sora', sans-serif",
        }}>{item.badge}</span>
      )}
      {collapsed && item.badge && (
        <span style={{
          position: 'absolute', top: 6, right: 8,
          background: C.blue, width: 8, height: 8, borderRadius: '50%',
        }} />
      )}
    </button>
  )
}

// ─────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────
function Topbar({ breadcrumbs, onMenuToggle }: {
  title: string
  breadcrumbs: { label: string; screen?: Screen }[]
  onMenuToggle: () => void
}) {
  const [showUser, setShowUser] = useState(false)
  return (
    <div style={{
      height: 60, background: `${C.bg}ee`,
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <button onClick={onMenuToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.gray, display: 'flex' }}>
        <Icon.Menu />
      </button>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Manrope', sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}>
          {breadcrumbs.map((b, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {i > 0 && <Icon.ChevronRight />}
              <span style={{ color: i === breadcrumbs.length - 1 ? C.white : C.gray }}>{b.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Notification */}
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.gray, display: 'flex', position: 'relative' }}>
        <Icon.Bell />
        <span style={{
          position: 'absolute', top: -2, right: -2,
          width: 8, height: 8, background: C.red, borderRadius: '50%',
        }} />
      </button>

      {/* User */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowUser(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: "'Sora', sans-serif",
          }}>CA</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.white, fontFamily: "'Sora', sans-serif" }}>Carlos Admin</div>
            <div style={{ fontSize: 10, color: C.gray, fontFamily: "'Manrope', sans-serif" }}>Super Admin</div>
          </div>
          <Icon.ChevronDown />
        </button>

        {showUser && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 8,
            background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: 6, minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            {['Meu Perfil', 'Configurações', '—', 'Sair'].map((item, i) => (
              item === '—'
                ? <div key={i} style={{ height: 1, background: C.border, margin: '4px 0' }} />
                : <button key={i} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer',
                  color: item === 'Sair' ? C.red : C.gray, fontSize: 13,
                  fontFamily: "'Manrope', sans-serif", borderRadius: 6,
                }}>{item}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PAGE WRAPPER
// ─────────────────────────────────────────────
export function Page({ title, breadcrumbs, actions, children, onNav }: {
  title: string
  breadcrumbs: { label: string }[]
  actions?: React.ReactNode
  children: React.ReactNode
  onNav?: (s: Screen) => void
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      <Sidebar
        current={title as Screen}
        onNav={s => onNav?.(s)}
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(v => !v)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar
          title={title}
          breadcrumbs={breadcrumbs}
          onMenuToggle={() => setSidebarCollapsed(v => !v)}
        />
        <main style={{ flex: 1, padding: 28, maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>{title}</h1>
            </div>
            {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

export const btnIcon: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 5,
  borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.15s',
}
