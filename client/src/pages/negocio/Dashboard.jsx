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
        <div style={styles.headerRight}>
          <span style={styles.negocioNombre}>{negocio?.nombre}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Salir</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.grid}>
          {/* Info del negocio */}
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Tu tarjeta</h3>
            <div style={styles.infoFila}>
              <span style={styles.infoLabel}>Tipo</span>
              <span style={styles.infoValor}>{negocio?.tipo}</span>
            </div>
            <div style={styles.infoFila}>
              <span style={styles.infoLabel}>Sellos</span>
              <span style={styles.infoValor}>{negocio?.num_sellos}</span>
            </div>
            <div style={styles.infoFila}>
              <span style={styles.infoLabel}>Premio</span>
              <span style={styles.infoValor}>{negocio?.premio}</span>
            </div>
            <div style={{ ...styles.infoFila, borderBottom: 'none' }}>
              <span style={styles.infoLabel}>Caducidad</span>
              <span style={styles.infoValor}>{negocio?.caducidad_meses} meses</span>
            </div>
          </div>

          {/* QR del negocio */}
          <div style={styles.qrCard}>
            <h3 style={styles.cardTitle}>Tu QR</h3>
            <p style={styles.qrSubtitle}>Muéstralo a tus clientes</p>
            <div style={styles.qrWrapper}>
              <QRCodeSVG
                value={qrUrl}
                size={130}
                fgColor="#1C1C1E"
                bgColor="#FFFFFF"
                level="M"
              />
            </div>
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
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column' },
  header: {
    backgroundColor: '#fff',
    padding: '0.6rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: '1.4rem', fontWeight: 'bold', color: '#E8763A', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  negocioNombre: { fontSize: '0.85rem', color: '#888', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  logoutBtn: {
    padding: '0.35rem 0.75rem',
    backgroundColor: 'transparent',
    border: '1.5px solid #E8763A',
    borderRadius: '8px',
    color: '#E8763A',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  content: {
    maxWidth: '900px',
    margin: '0.75rem auto',
    padding: '0 0.75rem',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '0.75rem',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '0.85rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '0.85rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: '0.6rem',
    marginTop: 0,
  },
  infoFila: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.45rem 0',
    borderBottom: '1px solid #f0f0f0',
  },
  infoLabel: { color: '#888', fontSize: '0.8rem' },
  infoValor: { color: '#1C1C1E', fontWeight: '600', fontSize: '0.8rem', textAlign: 'right', maxWidth: '55%' },
  qrSubtitle: {
    color: '#888',
    fontSize: '0.75rem',
    textAlign: 'center',
    marginBottom: '0.75rem',
    marginTop: 0,
  },
  qrWrapper: {
    padding: '0.6rem',
    backgroundColor: '#fff',
    borderRadius: '10px',
    border: '2px solid #f0f0f0',
  },
  scanBtn: {
    padding: '0.85rem',
    backgroundColor: '#E8763A',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
}