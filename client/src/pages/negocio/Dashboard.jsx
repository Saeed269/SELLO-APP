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
      const { data } = await supabase.from('negocios').select('*').eq('user_id', user.id).single()
      if (!data) { navigate('/negocio/onboarding') } else { setNegocio(data) }
      setLoading(false)
    }
    init()
  }, [navigate])

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #3D2314 0%, #5C4033 60%, #4A2E1A 100%)' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>Fidelización digital para tu negocio</p>
    </div>
  )

  const qrUrl = `${window.location.origin}/cliente/registro?negocio=${negocio?.id}`
  const qrSize = isMobile ? 200 : 260
  const cardPadding = isMobile ? '2rem 1.5rem' : '3rem 3rem'
  const cardMaxWidth = isMobile ? '100%' : '520px'
  const nombreSize = isMobile ? '1.5rem' : '2.2rem'

  return (
    <div style={s.root}>
      <NavNegocio negocio={negocio} user={user} />

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '2rem 1rem 1rem' : '3rem 2rem',
        backgroundColor: '#f5f5f5',
        minHeight: '100dvh',
        boxSizing: 'border-box',
      }}>
        <div style={{ ...s.tarjeta, maxWidth: cardMaxWidth, padding: cardPadding }}>
          <div style={s.blob1} />
          <div style={s.blob2} />
          <div style={s.blob3} />

          <h1 style={{ ...s.nombre, fontSize: nombreSize }}>{negocio?.nombre}</h1>

          <div style={{ ...s.qrWrap, padding: isMobile ? '14px' : '20px' }}>
            <QRCodeSVG value={qrUrl} size={qrSize} fgColor="#1C1C1E" bgColor="#FFFFFF" level="M" />
          </div>

          <p style={{ ...s.hint, fontSize: isMobile ? '0.72rem' : '0.85rem' }}>
            Los clientes escanean este QR para registrarse
          </p>

          <button
            onClick={() => navigate('/negocio/escanear')}
            style={{ ...s.btnEscanear, padding: isMobile ? '0.75rem' : '1rem', fontSize: isMobile ? '0.95rem' : '1rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              <line x1="7" y1="12" x2="17" y2="12"/>
            </svg>
            Escanear QR del Cliente
          </button>
        </div>
      </main>
    </div>
  )
}

const s = {
  root: { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  tarjeta: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #3D2314 0%, #5C4033 60%, #4A2E1A 100%)',
    borderRadius: '28px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem',
    boxShadow: '0 24px 64px rgba(192,58,6,0.35)',
  },
  blob1: { position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', top: -50, right: -50, pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', top: 80, left: -40, pointerEvents: 'none' },
  blob3: { position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,215,0,0.10)', bottom: 100, right: 30, pointerEvents: 'none' },
  nombre: {
    position: 'relative', zIndex: 1,
    margin: 0, fontWeight: '700', fontStyle: 'italic',
    color: '#fff', textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontFamily: 'Georgia, serif',
  },
  qrWrap: {
    position: 'relative', zIndex: 1,
    backgroundColor: '#fff', borderRadius: '20px',
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
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '10px',
    backdropFilter: 'blur(8px)',
  },
}