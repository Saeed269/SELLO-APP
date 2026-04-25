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
      if (!user) { navigate('/negocio/login'); return }
      setUser(user)

      const { data } = await supabase
        .from('negocios')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!data) { navigate('/negocio/onboarding') }
      else { setNegocio(data) }
      setLoading(false)
    }
    init()
  }, [navigate])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <p style={{ color: '#888' }}>Cargando...</p>
    </div>
  )

  const qrUrl = `${window.location.origin}/cliente/registro?negocio=${negocio?.id}`

  return (
    <div style={styles.root}>
      <NavNegocio negocio={negocio} user={user} />

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '5rem 1.25rem 2rem' : '2rem',
        backgroundColor: '#f5f5f5',
      }}>

        {/* Tarjeta */}
        <div style={{
          ...styles.tarjeta,
          maxWidth: isMobile ? '100%' : '460px',
          padding: isMobile ? '2.5rem 1.75rem' : '3rem 2.5rem',
        }}>

          {/* Blobs decorativos */}
          <div style={{ ...styles.blob, width: 180, height: 180, top: -40, right: -40, opacity: 0.18 }} />
          <div style={{ ...styles.blob, width: 120, height: 120, top: 60, left: -30, opacity: 0.12 }} />
          <div style={{ ...styles.blob, width: 80, height: 80, bottom: 80, right: 20, opacity: 0.10, background: '#FFD700' }} />

          {/* Nombre */}
          <h1 style={styles.nombre}>{negocio?.nombre}</h1>

          {/* Tipo */}
          <p style={styles.tipo}>{negocio?.tipo?.toUpperCase()}</p>

          {/* QR */}
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={qrUrl}
              size={isMobile ? 180 : 220}
              fgColor="#1C1C1E"
              bgColor="#FFFFFF"
              level="M"
            />
          </div>

          {/* Hint */}
          <p style={styles.hint}>
            Los clientes escanean este QR{'\n'}para registrarse y acumular sellos
          </p>

          {/* Botón escanear */}
          <button
            onClick={() => navigate('/negocio/escanear')}
            style={styles.btnEscanear}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              <line x1="7" y1="12" x2="17" y2="12"/>
            </svg>
            Escanear QR del Cliente
          </button>

        </div>
      </main>
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  tarjeta: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)',
    borderRadius: '28px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 24px 64px rgba(192,58,6,0.35)',
  },
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    background: '#fff',
    filter: 'blur(2px)',
    pointerEvents: 'none',
  },
  nombre: {
    position: 'relative',
    margin: 0,
    fontSize: '2rem',
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#fff',
    textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontFamily: 'Georgia, serif',
    zIndex: 1,
  },
  tipo: {
    position: 'relative',
    margin: 0,
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: '0.18em',
    textAlign: 'center',
    zIndex: 1,
  },
  qrWrap: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: '18px',
    padding: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    marginTop: '0.5rem',
  },
  hint: {
    position: 'relative',
    zIndex: 1,
    margin: 0,
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 1.6,
    whiteSpace: 'pre-line',
  },
  btnEscanear: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    padding: '0.9rem',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.5)',
    borderRadius: '14px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backdropFilter: 'blur(8px)',
    marginTop: '0.25rem',
  },
}