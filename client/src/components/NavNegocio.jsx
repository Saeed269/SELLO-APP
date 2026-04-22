import { useNavigate, useLocation } from 'react-router-dom'

export default function NavNegocio() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = window.innerWidth < 768

  const items = [
    { label: 'Inicio', icon: '🏠', path: '/negocio/dashboard' },
    { label: 'Escanear', icon: '📷', path: '/negocio/escanear' },
    { label: 'Clientes', icon: '👥', path: '/negocio/clientes' },
    { label: 'Ajustes', icon: '⚙️', path: '/negocio/ajustes' },
  ]

  const isActive = (path) => location.pathname === path

  if (isMobile) {
    return (
      <nav style={styles.bottomNav}>
        {items.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.navItem,
              color: isActive(item.path) ? '#E8763A' : '#888',
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={{
              ...styles.navLabel,
              fontWeight: isActive(item.path) ? 'bold' : 'normal',
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
            color: isActive(item.path) ? '#E8763A' : '#555',
            borderBottom: isActive(item.path) ? '2px solid #E8763A' : '2px solid transparent',
          }}
        >
          {item.icon} {item.label}
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
    padding: '0.5rem 0 0.75rem 0',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
    zIndex: 100,
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem 1rem',
    gap: '0.2rem',
  },
  navIcon: { fontSize: '1.3rem' },
  navLabel: { fontSize: '0.7rem' },
  topNav: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  topNavItem: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    padding: '0.5rem 0.75rem',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
}