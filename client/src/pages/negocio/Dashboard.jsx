import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import NavNegocio from '../../components/NavNegocio'

const TIPOS_EMOJI = {
  'Cafetería': '☕',
  'Restaurante': '🍽️',
  'Pizzería': '🍕',
  'Kebab': '🌯',
  'Peluquería / Barbería': '✂️',
  'Gimnasio': '💪',
  'Centro de Yoga': '🧘',
  'Entrenador Personal': '🏋️',
  'Salón de Manicura': '💅',
  'Centro de Masaje': '💆',
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
  const emoji = TIPOS_EMOJI[negocio?.tipo] || '🏪'

  return (
    <div style={styles.root}>
      <NavNegocio negocio={negocio} user={user} />

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '5rem 1rem 2rem' : '2rem',
      }}>
        <div style={styles.tarjeta}>

          {/* Emoji negocio */}
          <div style={styles.emojiWrap}>
            <span style={styles.emoji}>{emoji}</span>
          </div>

          {/* Nombre y tipo */}
          <h1 style={styles.nombre}>{negocio?.nombre}</h1>
          <p style={styles.tipo}>{negocio?.tipo}</p>

          {/* Separador */}
          <div style={styles.separador} />

          {/* QR */}
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={qrUrl}
              size={180}
              fgColor="#1C1C1E"
              bgColor="#FFFFFF"
              level="M"
            />
          </div>

          <p style={styles.qrHint}>Los clientes escanean este QR para registrarse</p>

          {/* Separador */}
          <div style={styles.separador} />

          {/* Botón escanear */}
          <button
            onClick={() => navigate('/negocio/escanear')}
            style={styles.btnEscanear}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              <line x1="7" y1="12" x2="17" y2="12"/>
            </svg>
            Escanear QR del Cliente
          </button>

          {/* Premio y sellos al pie */}
          <p style={styles.pie}>
            🏆 Premio: {negocio?.premio} · {negocio?.num_sellos} sellos
          </p>

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
    backgroundColor: '#fff',
    borderRadius: '24px',
    border: '2.5px solid #E8763A',
    padding: '2rem 2rem 1.5rem',
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 8px 32px rgba(232,118,58,0.12)',
  },
  emojiWrap: {
    width: 64,
    height: 64,
    borderRadius: '18px',
    backgroundColor: '#FFF4EE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  emoji: {
    fontSize: '2rem',
  },
  nombre: {
    margin: '0 0 4px',
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  tipo: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#888',
    textAlign: 'center',
  },
  separador: {
    width: '100%',
    height: 0,
    borderTop: '1.5px dashed #e0e0e0',
    margin: '1.25rem 0',
  },
  qrWrap: {
    padding: '14px',
    border: '2px solid #E8763A',
    borderRadius: '16px',
    backgroundColor: '#fff',
    marginBottom: '0.75rem',
  },
  qrHint: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#aaa',
    textAlign: 'center',
  },
  btnEscanear: {
    width: '100%',
    padding: '0.9rem',
    backgroundColor: '#E8763A',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  pie: {
    margin: '1rem 0 0',
    fontSize: '0.75rem',
    color: '#aaa',
    textAlign: 'center',
  },
}