import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import NavNegocio from '../../components/NavNegocio'

const TIPOS_EMOJI = {
  'Cafetería': '☕', 'Restaurante': '🍽️', 'Pizzería': '🍕', 'Kebab': '🌯',
  'Peluquería / Barbería': '✂️', 'Gimnasio': '💪', 'Centro de Yoga': '🧘',
  'Entrenador Personal': '🏋️', 'Salón de Manicura': '💅', 'Centro de Masaje': '💆',
}

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
      const { data } = await supabase.from('negocios').select('*').eq('user_id', user.id).single()
      if (!data) { navigate('/negocio/onboarding') } else { setNegocio(data) }
      setLoading(false)
    }
    init()
  }, [navigate])

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>Fidelización digital para tu negocio</p>
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
        padding: isMobile ? '2rem 1rem 1rem' : '2rem',
        backgroundColor: '#f5f5f5',
        minHeight: '100dvh',
        boxSizing: 'border-box',
      }}>
        <div style={{
          ...styles.tarjeta,
          maxWidth: isMobile ? '100%' : '460px',
          padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
          gap: isMobile ? '1rem' : '1rem',
        }}>

          <div style={styles.blob1} />
          <div style={styles.blob2} />
          <div style={styles.blob3} />

          <h1 style={{
            ...styles.nombre,
            fontSize: isMobile ? '1.5rem' : '2rem',
          }}>{negocio?.nombre}</h1>

          <p style={styles.tipo}>{negocio?.tipo?.toUpperCase()}</p>

          <div style={{
            ...styles.qrWrap,
            padding: isMobile ? '14px' : '16px',
          }}>
            <QRCodeSVG
              value={qrUrl}
              size={isMobile ? 200 : 220}
              fgColor="#1C1C1E"
              bgColor="#FFFFFF"
              level="M"
            />
          </div>

          <p style={{ ...styles.hint, fontSize: isMobile ? '0.72rem' : '0.78rem' }}>
            Los clientes escanean este QR para registrarse
          </p>

          <button
            onClick={() => navigate('/negocio/escanear')}
            style={{ ...styles.btnEscanear, padding: isMobile ? '0.75rem' : '0.9rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  root: { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  tarjeta: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)',
    borderRadius: '28px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 24px 64px rgba(192,58,6,0.35)',
  },
  blob1: { position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', top: -40, right: -40, pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', top: 60, left: -30, pointerEvents: 'none' },
  blob3: { position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,215,0,0.10)', bottom: 80, right: 20, pointerEvents: 'none' },
  nombre: {
    position: 'relative', zIndex: 1,
    margin: 0,
    fontWeight: '700', fontStyle: 'italic',
    color: '#fff', textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontFamily: 'Georgia, serif',
  },
  tipo: {
    position: 'relative', zIndex: 1,
    margin: 0, fontSize: '0.7rem', fontWeight: '600',
    color: 'rgba(255,255,255,0.75)', letterSpacing: '0.18em', textAlign: 'center',
  },
  qrWrap: {
    position: 'relative', zIndex: 1,
    backgroundColor: '#fff', borderRadius: '18px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  hint: {
    position: 'relative', zIndex: 1,
    margin: 0, color: 'rgba(255,255,255,0.8)',
    textAlign: 'center', lineHeight: 1.5,
  },
  btnEscanear: {
    position: 'relative', zIndex: 1,
    width: '100%',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.5)',
    borderRadius: '14px',
    fontSize: '0.95rem', fontWeight: '600',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '10px',
    backdropFilter: 'blur(8px)',
  },
}