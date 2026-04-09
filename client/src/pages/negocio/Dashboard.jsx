import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/negocio/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/negocio/login')
  }

  if (!user) return null

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>SELLO</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Cerrar sesión
        </button>
      </div>

      <div style={styles.content}>
        <h2 style={styles.welcome}>Bienvenido 👋</h2>
        <p style={styles.email}>{user.email}</p>

        <div style={styles.emptyCard}>
          <p style={styles.emptyText}>
            Aquí aparecerá la configuración de tu tarjeta de sellos.
          </p>
          <p style={styles.emptySubtext}>Próximamente...</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#E8763A',
    margin: 0,
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1.5px solid #E8763A',
    borderRadius: '8px',
    color: '#E8763A',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  content: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  welcome: {
    fontSize: '1.8rem',
    color: '#1C1C1E',
    margin: '0 0 0.25rem 0',
  },
  email: {
    color: '#888',
    marginBottom: '2rem',
    fontSize: '0.95rem',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '3rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '2px dashed #E8E0D8',
  },
  emptyText: {
    color: '#555',
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  emptySubtext: {
    color: '#bbb',
    fontSize: '0.9rem',
  },
}