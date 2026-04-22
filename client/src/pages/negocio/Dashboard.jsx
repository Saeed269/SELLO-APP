import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import NavNegocio from '../../components/NavNegocio'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
          {!isMobile && <NavNegocio />}
          {!isMobile && <span style={styles.email}>{user?.email}</span>}
          <button onClick={handleLogout} style={styles.logoutBtn}>
            {isMobile ? 'Salir' : 'Cerrar sesión'}
          </button>
        </div>
      </div>

      {isMobile && <NavNegocio />}

      <div style={{
        ...styles.content,
        padding: isMobile ? '0 0.75rem' : '0 1rem',
        margin: isMobile ? '0.75rem auto' : '2rem auto',
        paddingBottom: isMobile ? '5rem' : '1rem',
      }}>
        {!isMobile && (
          <>
            <h2 style={styles.welcome}>Bienvenido, {negocio?.nombre} 👋</h2>
            <p style={styles.emailText}>{user?.email}</p>
          </>
        )}

        <div style={{
          ...styles.grid,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '0.75rem' : '1.5rem',
        }}>
          <div style={{ ...styles.infoCard, padding: isMobile ? '0.85rem' : '1.5rem' }}>
            <h3 style={{ ...styles.cardTitle, fontSize: isMobile ? '0.95rem' : '1rem' }}>
              {isMobile ? negocio?.nombre : 'Tu tarjeta'}
            </h3>
            {!isMobile && (
              <div style={styles.infoFila}>
                <span style={styles.infoLabel}>Tipo</span>
                <span style={styles.infoValor}>{negocio?.tipo}</span>
              </div>
            )}
            <div style={styles.infoFila}>
              <span style={styles.infoLabel}>Sellos para premio</span>
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

          <div style={{ ...styles.qrCard, padding: isMobile ? '0.85rem' : '1.5rem' }}>
            <h3 style={{ ...styles.cardTitle, fontSize: isMobile ? '0.95rem' : '1rem' }}>QR</h3>
            <div style={styles.qrWrapper}>
              <QRCodeSVG
                value={qrUrl}
                size={isMobile ? 130 : 180}
                fgColor="#1C1C1E"
                bgColor="#FFFFFF"
                level="M"
              />
            </div>
            <p style={styles.qrUrl}>{qrUrl}</p>
          </div>
        </div>

        {!isMobile && (
          <button
            onClick={() => navigate('/negocio/escanear')}
            style={styles.scanBtn}
          >
            📷 Escanear QR de cliente
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff',
    padding: '0.75rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#E8763A', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  email: { fontSize: '0.85rem', color: '#888' },
  emailText: { color: '#888', marginBottom: '2rem', fontSize: '0.95rem' },
  logoutBtn: {
    padding: '0.4rem 0.85rem',
    backgroundColor: 'transparent',
    border: '1.5px solid #E8763A',
    borderRadius: '8px',
    color: '#E8763A',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  content: {
    maxWidth: '900px',
    width: '100%',
    boxSizing: 'border-box',
  },
  welcome: { fontSize: '1.8rem', color: '#1C1C1E', margin: '0 0 0.25rem 0' },
  grid: {
    display: 'grid',
    marginBottom: '1rem',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: '0.75rem',
    marginTop: 0,
  },
  infoFila: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.6rem 0',
    borderBottom: '1px solid #f0f0f0',
  },
  infoLabel: { color: '#888', fontSize: '0.85rem' },
  infoValor: { color: '#1C1C1E', fontWeight: '600', fontSize: '0.85rem', textAlign: 'right', maxWidth: '55%' },
  qrWrapper: {
    padding: '0.75rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '2px solid #f0f0f0',
    marginBottom: '0.75rem',
  },
  qrUrl: {
    fontSize: '0.65rem',
    color: '#bbb',
    textAlign: 'center',
    wordBreak: 'break-all',
    margin: 0,
    maxWidth: '220px',
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