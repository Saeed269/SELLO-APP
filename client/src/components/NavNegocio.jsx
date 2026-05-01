import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase'

const NARANJA = '#E8763A'
const SIDEBAR_BG = '#1C1C1E'
const SIDEBAR_WIDTH = 360

const icons = {
  inicio: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? NARANJA : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  tarjeta: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? NARANJA : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  clientes: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? NARANJA : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  analiticas: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? NARANJA : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  ayuda: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? NARANJA : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  ajustes: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? NARANJA : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
}

const items = [
  { label: 'Inicio',      icon: 'inicio',     path: '/negocio/dashboard' },
  { label: 'Mi Tarjeta',  icon: 'tarjeta',    path: '/negocio/mi-tarjeta' },
  { label: 'Clientes',    icon: 'clientes',   path: '/negocio/clientes' },
  { label: 'Analíticas', icon: 'analiticas', path: '/negocio/analiticas' },
  { label: 'Ayuda', icon: 'ayuda', path: '/negocio/ayuda' },
  { label: 'Ajustes', icon: 'ajustes', path: '/negocio/ajustes' },
]

const idiomas = ['Español', 'Català', 'English']

export default function NavNegocio({ negocio, user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [open, setOpen] = useState(false)
  const [idioma, setIdioma] = useState('Español')
  const [showIdioma, setShowIdioma] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNav = (path) => {
    if (!path) return
    navigate(path)
    setOpen(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/negocio/login')
  }

  const isActive = (path) => location.pathname === path

  const sidebarContent = (
    <div style={styles.sidebar}>
      <div style={styles.logoArea}>
        <span style={styles.logoText}>SELLO</span>
      </div>

      <nav style={styles.nav}>
        {items.map(item => {
          const active = isActive(item.path)
          return (
            <button
              key={item.label}
              onClick={() => handleNav(item.path)}
              style={{
                ...styles.navItem,
                backgroundColor: active ? 'rgba(232,118,58,0.12)' : 'transparent',
                borderLeft: active ? `3px solid ${NARANJA}` : '3px solid transparent',
              }}
            >
              {icons[item.icon](active)}
              <span style={{ ...styles.navLabel, color: active ? NARANJA : '#9CA3AF' }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      <div style={styles.extra}>
        <div style={styles.separador} />

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowIdioma(!showIdioma)} style={styles.extraBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span style={styles.extraLabel}>{idioma}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showIdioma && (
            <div style={styles.dropdown}>
              {idiomas.map(i => (
                <button key={i} onClick={() => { setIdioma(i); setShowIdioma(false) }} style={{
                  ...styles.dropdownItem,
                  color: i === idioma ? NARANJA : '#9CA3AF',
                }}>
                  {i}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => {}} style={styles.extraBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <span style={styles.extraLabel}>Términos de uso</span>
        </button>

        <button onClick={() => {}} style={styles.extraBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span style={styles.extraLabel}>Política de privacidad</span>
        </button>

        <div style={styles.separador} />

        <button onClick={handleLogout} style={styles.logoutBtn}>
          {icons.logout()}
          <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ ...styles.hamburger, display: open ? 'none' : 'flex' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {open && (
          <div onClick={() => setOpen(false)} style={styles.overlay} />
        )}

        <div style={{
          ...styles.mobileSidebar,
          transform: open ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`,
        }}>
          {sidebarContent}
        </div>
      </>
    )
  }

  return sidebarContent
}

const styles = {
  sidebar: {
    width: SIDEBAR_WIDTH,
    minWidth: SIDEBAR_WIDTH,
    height: '100dvh',
    backgroundColor: SIDEBAR_BG,
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
    overflowY: 'auto',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem 1.25rem 1.25rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  logoText: {
    color: NARANJA,
    fontWeight: 'bold',
    fontSize: '1.3rem',
    letterSpacing: '0.12em',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0.75rem 0',
    gap: '2px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.65rem 0.85rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'background 0.15s',
  },
  navLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  extra: {
    padding: '0 0.75rem 1rem',
    flexShrink: 0,
  },
  separador: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    margin: '0.75rem 0',
  },
  extraBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.5rem 0.85rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    width: '100%',
    textAlign: 'left',
  },
  extraLabel: {
    fontSize: '0.78rem',
    color: '#6B7280',
  },
  dropdown: {
    backgroundColor: '#2A2A2C',
    borderRadius: '8px',
    padding: '4px',
    marginTop: '2px',
    marginLeft: '0.85rem',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '6px 10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '0.78rem',
    textAlign: 'left',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0.65rem 0.85rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '10px',
    width: '100%',
  },
  hamburger: {
    position: 'fixed',
    top: '1rem',
    left: '1rem',
    zIndex: 200,
    background: '#fff',
    border: 'none',
    borderRadius: '10px',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 150,
  },
  mobileSidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100dvh',
    width: SIDEBAR_WIDTH,
    zIndex: 160,
    transition: 'transform 0.25s ease',
  },
}