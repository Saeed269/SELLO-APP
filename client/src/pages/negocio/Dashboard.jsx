import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import NavNegocio from '../../components/NavNegocio'
import LoadingScreen from '../../components/ui/LoadingScreen'
import { useAuth } from '../../hooks/useAuth'
import { COLORS } from '../../constants'

function darkenColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)})`
}

function ScanIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
      <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
      <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
    </svg>
  )
}

export default function Dashboard() {
  const { user, negocio, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) return <LoadingScreen />

  const diseno   = negocio?.diseno || {}
  const color    = diseno.color || COLORS.primary
  const colDark  = darkenColor(color)
  const estilo   = diseno.estilo || 'blob'
  const qrUrl    = `${window.location.origin}/cliente/registro?negocio=${negocio?.id}`
  const bgStyle  = estilo === 'dark'
    ? { background: color }
    : { background: `linear-gradient(145deg, ${colDark} 0%, ${color} 60%, ${colDark} 100%)` }

  return (
    <div style={s.root}>
      <NavNegocio negocio={negocio} user={user} />
      <main style={s.main}>
        <div style={{ ...s.card, ...bgStyle, boxShadow: `0 24px 64px ${color}55` }}>
          <div style={s.blob1} />
          <div style={s.blob2} />
          <div style={s.blob3} />

          <h1 style={s.nombre}>{negocio?.nombre}</h1>

          <div style={s.qrWrap}>
            <QRCodeSVG value={qrUrl} size={240} fgColor="#1C1C1E" bgColor="#FFFFFF" level="M" />
          </div>

          <p style={s.hint}>Los clientes escanean este QR para registrarse</p>

          <button onClick={() => navigate('/negocio/escanear')} style={s.btnScan}>
            <ScanIcon />
            Escanear QR del Cliente
          </button>
        </div>
      </main>
    </div>
  )
}

const s = {
  root:    { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  main:    { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', minHeight: '100dvh', boxSizing: 'border-box' },
  card:    { position: 'relative', overflow: 'hidden', borderRadius: '28px', width: '100%', maxWidth: '520px', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' },
  blob1:   { position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', top: -50, right: -50, pointerEvents: 'none' },
  blob2:   { position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', top: 80, left: -40, pointerEvents: 'none' },
  blob3:   { position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,215,0,0.10)', bottom: 100, right: 30, pointerEvents: 'none' },
  nombre:  { position: 'relative', zIndex: 1, margin: 0, fontSize: '2.2rem', fontWeight: '700', fontStyle: 'italic', color: '#fff', textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.15)', fontFamily: 'Georgia, serif' },
  qrWrap:  { position: 'relative', zIndex: 1, backgroundColor: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  hint:    { position: 'relative', zIndex: 1, margin: 0, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 1.5, fontSize: '0.85rem' },
  btnScan: { position: 'relative', zIndex: 1, width: '100%', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backdropFilter: 'blur(8px)', padding: '1rem', fontSize: '1rem' },
}