import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

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

  const qrUrl = `${window.location.origin}/cliente/registro?negocio=${negocio?.id}`

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

        <div style={styles.grid}>
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Tu tarjeta</h3>
            <div style={styles.infoFila}>
              <span style={styles.infoLabel}>Tipo</span>
              <span style={styles.infoValor}>{negocio?.tipo}</span>
            </div>
            <div style={styles.infoFila}>
              <span style={styles.infoLabel}>Sellos para premio</span>
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

          <div style={styles.qrCard}>
            <h3 style={styles.cardTitle}>Tu QR</h3>
            <p style={styles.qrSubtitle}>
              Muestra este QR a tus clientes para que se registren
            </p>
            <div style={styles.qrWrapper}>
              <QRCodeSVG
                value={qrUrl}
                size={180}
                fgColor="#1C1C1E"
                bgColor="#FFFFFF"
                level="M"
              />
            </div>
            <p style={styles.qrUrl}>{qrUrl}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/negocio/escanear')}
          style={styles.scanBtn}
        >
          📷 Escanear QR de cliente
        </button>
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
  content: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  welcome: { fontSize: '1.8rem', color: '#1C1C1E', margin: '0 0 0.25rem 0' },
  email: { color: '#888', marginBottom: '2rem', fontSize: '0.95rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
},
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: '1rem',
    marginTop: 0,
  },
  infoFila: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f0f0f0',
  },
  infoLabel: { color: '#888', fontSize: '0.95rem' },
  infoValor: { color: '#1C1C1E', fontWeight: '600', fontSize: '0.95rem' },
  qrSubtitle: {
    color: '#888',
    fontSize: '0.85rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
    marginTop: 0,
  },
  qrWrapper: {
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '2px solid #f0f0f0',
    marginBottom: '1rem',
  },
  qrUrl: {
    fontSize: '0.7rem',
    color: '#bbb',
    textAlign: 'center',
    wordBreak: 'break-all',
    margin: 0,
  },
  scanBtn: {
    padding: '1rem',
    backgroundColor: '#E8763A',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginTop: '1.5rem',
  },
}