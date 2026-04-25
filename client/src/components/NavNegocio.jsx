import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase'

const NARANJA = '#E8763A'
const SIDEBAR_BG = '#1C1C1E'
const SIDEBAR_WIDTH = 280

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
  { label: 'Analíticas',  icon: 'analiticas', path: '/negocio/analiticas' },
  { label: 'Ayuda',       icon: 'ayuda',      path: '/negocio/ayuda' },
  { label: 'Ajustes',     icon: 'ajustes',    path: '/negocio/ajustes' },
]

export default function NavNegocio({ negocio, user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Cierra el sidebar al navegar en móvil
  const handleNav = (path) => {
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
      {/* Logo */}
      <div style={styles.logoArea}>
        <div style={styles.logoIcon}>S</div>
        <span style={styles.logoText}>SELLO</span>
      </div>

      {/* Navegación */}
      <nav style={styles.nav}>
        {items.map(item => {
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
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

      {/* Perfil + logout abajo */}
      <div style={styles.bottom}>
        <div style={styles.perfil}>
          <div style={styles.perfilAvatar}>
            {(negocio?.nombre || user?.email || 'N')[0].toUpperCase()}
          </div>
          <div style={styles.perfilInfo}>
            <p style={styles.perfilNombre}>{negocio?.nombre || 'Mi Negocio'}</p>
            <p style={styles.perfilEmail}>{user?.email || ''}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          {icons.logout()}
          <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )

  // MÓVIL: hamburger + overlay + sidebar deslizante
  if (isMobile) {
    return (
      <>
        {/* Botón hamburger — solo visible cuando sidebar cerrado */}
        <button onClick={() => setOpen(true)} style={{ ...styles.hamburger, display: open ? 'none' : 'flex' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Overlay oscuro */}
        {open && (
          <div onClick={() => setOpen(false)} style={styles.overlay} />
        )}

        {/* Sidebar deslizante */}
        <div style={{
          ...styles.mobileSidebar,
          transform: open ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`,
        }}>
          {sidebarContent}
        </div>
      </>
    )
  }

  // DESKTOP: sidebar fijo
  return sidebarContent
}

const styles = {
  sidebar: {
    width: SIDEBAR_WIDTH,
    minWidth: SIDEBAR_WIDTH,
    height: '100vh',
    backgroundColor: SIDEBAR_BG,
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '1.5rem 1.25rem 1.25rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: NARANJA,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    letterSpacing: '0.08em',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0.75rem',
    gap: '2px',
    overflowY: 'auto',
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
  bottom: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  perfil: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0.5rem 0.5rem',
  },
  perfilAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: NARANJA,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  perfilInfo: {
    overflow: 'hidden',
  },
  perfilNombre: {
    margin: 0,
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  perfilEmail: {
    margin: 0,
    fontSize: '0.7rem',
    color: '#6B7280',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0.5rem 0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
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
    height: '100vh',
    width: SIDEBAR_WIDTH,
    zIndex: 160,
    transition: 'transform 0.25s ease',
  },
}