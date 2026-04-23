import { useNavigate, useLocation } from 'react-router-dom'

const icons = {
  dashboard: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#E8763A' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  scan: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#E8763A' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
    </svg>
  ),
  clients: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#E8763A' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  settings: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#E8763A' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
}

export default function NavNegocio() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = window.innerWidth < 768

  const items = [
    { label: 'Inicio', icon: 'dashboard', path: '/negocio/dashboard' },
    { label: 'Escanear', icon: 'scan', path: '/negocio/escanear' },
    { label: 'Clientes', icon: 'clients', path: '/negocio/clientes' },
    { label: 'Ajustes', icon: 'settings', path: '/negocio/ajustes' },
  ]

  const isActive = (path) => location.pathname === path

  if (isMobile) {
    return (
      <nav style={styles.bottomNav}>
        {items.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={styles.navItem}
          >
            {icons[item.icon](isActive(item.path))}
            <span style={{
              ...styles.navLabel,
              color: isActive(item.path) ? '#E8763A' : '#9CA3AF',
              fontWeight: isActive(item.path) ? '600' : '400',
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    )
  }

  return (
    <nav style={styles.topNav}>
      {items.map(item => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            ...styles.topNavItem,
            color: isActive(item.path) ? '#E8763A' : '#6B7280',
            borderBottom: isActive(item.path) ? '2px solid #E8763A' : '2px solid transparent',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {icons[item.icon](isActive(item.path))}
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  )
}

const styles = {
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '0.6rem 0 1rem 0',
    boxShadow: '0 -1px 0 #F3F4F6, 0 -4px 12px rgba(0,0,0,0.06)',
    zIndex: 100,
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.2rem 1.2rem',
    gap: '0.25rem',
  },
  navLabel: {
    fontSize: '0.68rem',
    letterSpacing: '0.01em',
  },
  topNav: {
    display: 'flex',
    gap: '0.25rem',
    alignItems: 'center',
  },
  topNavItem: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    padding: '0.6rem 0.85rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.15s',
  },
}