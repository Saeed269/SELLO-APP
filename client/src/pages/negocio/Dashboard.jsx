import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/negocio/login')
        return
      }
      setUser(user)

      const { data } = await supabase
        .from('negocios')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!data) {
        navigate('/negocio/onboarding')
      } else {
        setNegocio(data)
      }
      setLoading(false)
    }
    init()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/negocio/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Cargando...</p>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>SELLO</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Cerrar sesión
        </button>
      </div>

      <div style={styles.content}>
        <h2 style={styles.welcome}>Bienvenido, {negocio?.nombre} 👋</h2>
        <p style={styles.email}>{user?.email}</p>

        <div style={styles.infoCard}>
          <div style={styles.infoFila}>
            <span style={styles.infoLabel}>Tipo de negocio</span>
            <span style={styles.infoValor}>{negocio?.tipo}</span>
          </div>
          <div style={styles.infoFila}>
            <span style={styles.infoLabel}>Sellos para el premio</span>
            <span style={styles.infoValor}>{negocio?.num_sellos}</span>
          </div>
          <div style={styles.infoFila}>
            <span style={styles.infoLabel}>Premio</span>
            <span style={styles.infoValor}>{negocio?.premio}</span>
          </div>
          <div style={styles.infoFila}>
            <span style={styles.infoLabel}>Caducidad</span>
            <span style={styles.infoValor}>{negocio?.caducidad_meses} meses</span>
          </div>
        </div>

        <div style={styles.emptyCard}>
          <p style={styles.emptyText}>Tu QR del negocio aparecerá aquí próximamente.</p>
          <p style={styles.emptySubtext}>Semana 2 →</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: '1.8rem', fontWeight: 'bold', color: '#E8763A', margin: 0 },
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
  content: { maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' },
  welcome: { fontSize: '1.8rem', color: '#1C1C1E', margin: '0 0 0.25rem 0' },
  email: { color: '#888', marginBottom: '2rem', fontSize: '0.95rem' },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '1.5rem',
  },
  infoFila: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f0f0f0',
  },
  infoLabel: { color: '#888', fontSize: '0.95rem' },
  infoValor: { color: '#1C1C1E', fontWeight: '600', fontSize: '0.95rem' },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '3rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '2px dashed #E8E0D8',
  },
  emptyText: { color: '#555', fontSize: '1rem', marginBottom: '0.5rem' },
  emptySubtext: { color: '#bbb', fontSize: '0.9rem' },
}