import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

// ─── Helpers ──────────────────────────────────────────────────

function darkenColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)})`
}

// ─── Efecto decorativo ────────────────────────────────────────

function Efecto({ tipo }) {
  const svgStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }
  if (tipo === 'blobs') return (
    <>
      <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', top: -70, right: -70, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', bottom: -50, left: -50, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,215,0,0.12)', top: '40%', right: 10, pointerEvents: 'none', zIndex: 0 }} />
    </>
  )
  if (tipo === 'bubbles') return (
    <>
      <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', top: -50, right: -50, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', bottom: -30, left: -30, pointerEvents: 'none', zIndex: 0 }} />
    </>
  )
  if (tipo === 'lines') return (
    <svg style={svgStyle} viewBox="0 0 300 300" opacity="0.08">
      {[0,1,2,3,4,5,6].map(i => <line key={i} x1={i*50-10} y1="0" x2={i*50+30} y2="300" stroke="white" strokeWidth="1.5" />)}
    </svg>
  )
  if (tipo === 'waves') return (
    <svg style={svgStyle} viewBox="0 0 300 300" preserveAspectRatio="none" opacity="0.1">
      <path d="M0,80 Q75,60 150,80 Q225,100 300,80 L300,300 L0,300 Z" fill="white" />
      <path d="M0,140 Q75,120 150,140 Q225,160 300,140 L300,300 L0,300 Z" fill="white" />
    </svg>
  )
  return null
}

// ─── Icono SVG ────────────────────────────────────────────────

function IconSVG({ path, size = 14, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: `<path d="${path}"/>` }}
    />
  )
}

// ─── Tarjeta Moderno ──────────────────────────────────────────

function TarjetaModerno({ diseno, nombre, totalSellos, sellosActuales, premios, qrCliente, premioGanado }) {
  const col = diseno?.color || '#E65100'
  const colDark = darkenColor(col)
  const cols = totalSellos <= 8 ? 4 : 5
  const selloPath = diseno?.selloPath || 'M20 6L9 17l-5-5'
  const premioPremioPath = diseno?.premioPath || 'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'
  const efecto = diseno?.efecto || 'blobs'
  const ultimoPremio = premios?.[premios.length - 1]?.texto || ''

  return (
    <div style={{ borderRadius: '28px', background: `linear-gradient(145deg, ${colDark} 0%, ${col} 60%, ${colDark} 100%)`, padding: '2rem 1.75rem', position: 'relative', overflow: 'hidden', boxShadow: `0 24px 64px ${col}55`, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Efecto tipo={efecto} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', fontStyle: 'italic', color: '#fff', fontFamily: 'Georgia, serif' }}>{nombre}</h2>
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}>
        {Array.from({ length: totalSellos }).map((_, i) => {
          const marcado = i < sellosActuales
          const esUltimo = i === totalSellos - 1
          return (
            <div key={i} style={{ aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: marcado ? (esUltimo ? '#FFD700' : '#fff') : 'rgba(255,255,255,0.2)', border: marcado ? 'none' : '1.5px solid rgba(255,255,255,0.35)' }}>
              {marcado && (
                esUltimo
                  ? <IconSVG path={premioPremioPath} size={14} color={col} />
                  : <IconSVG path={selloPath} size={14} color={col} />
              )}
            </div>
          )
        })}
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '5px 14px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#fff', fontWeight: '500' }}>🎁 Premio: {ultimoPremio}</p>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
          {premioGanado ? '🎉 ¡Premio listo! Muestra este QR al negocio' : 'Muestra este QR para recibir tu sello'}
        </p>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          <QRCodeSVG value={qrCliente} size={160} fgColor="#1C1C1E" bgColor="#FFFFFF" level="M" />
        </div>
      </div>
    </div>
  )
}

// ─── Tarjeta Clásico ──────────────────────────────────────────

function TarjetaClasico({ diseno, nombre, totalSellos, sellosActuales, premios, qrCliente, premioGanado }) {
  const col = diseno?.color || '#E65100'
  const cols = totalSellos <= 8 ? 4 : 5
  const selloPath = diseno?.selloPath || 'M20 6L9 17l-5-5'
  const premioPremioPath = diseno?.premioPath || 'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'
  const efecto = diseno?.efecto || 'none'
  const ultimoPremio = premios?.[premios.length - 1]?.texto || ''

  return (
    <div style={{ borderRadius: '28px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', width: '100%' }}>
      <div style={{ background: col, padding: '2rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
        <Efecto tipo={efecto} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.75rem', fontWeight: '700', fontStyle: 'italic', color: '#fff', fontFamily: 'Georgia, serif' }}>{nombre}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}>
            {Array.from({ length: totalSellos }).map((_, i) => {
              const marcado = i < sellosActuales
              const esUltimo = i === totalSellos - 1
              return (
                <div key={i} style={{ aspectRatio: '1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: marcado ? (esUltimo ? '#FFD700' : 'rgba(255,255,255,0.85)') : 'rgba(255,255,255,0.12)', border: marcado ? 'none' : '1.5px solid rgba(255,255,255,0.25)' }}>
                  {marcado && (
                    esUltimo
                      ? <IconSVG path={premioPremioPath} size={14} color="#1C1C1E" />
                      : <IconSVG path={selloPath} size={14} color="#1C1C1E" />
                  )}
                </div>
              )
            })}
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
            🎁 Premio: {ultimoPremio}
          </p>
        </div>
      </div>

      <div style={{ background: '#2a2a2a', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          {premioGanado ? '🎉 ¡Premio listo! Muestra este QR al negocio' : 'Muestra este QR para recibir tu sello'}
        </p>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <QRCodeSVG value={qrCliente} size={160} fgColor="#1C1C1E" bgColor="#FFFFFF" level="M" />
        </div>
      </div>
    </div>
  )
}

// ─── Iconos por tipo de negocio ───────────────────────────────

const ICONOS_SELLO = {
  'Cafetería':           'M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z',
  'Restaurante':         'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7',
  'Panadería & Pastelería': 'M20 6L9 17l-5-5',
  'Peluquería & Barbería': 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 4 8.12 15.88M8.12 8.12 12 12m7.88 7.88L12 12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  'Manicura & Estética': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
  'Masajes & Spa':       'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
  'Yoga & Pilates':      'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41',
  'Entrenador Personal': 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  default:               'M20 6L9 17l-5-5',
}

const ICONOS_PREMIO = {
  gift:    'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  trophy:  'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z',
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  crown:   'M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294zM5 21h14',
  sparkle: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
}

// ─── Componente principal ─────────────────────────────────────

export default function Tarjeta() {
  const [searchParams] = useSearchParams()
  const negocioId = searchParams.get('negocio')
  const [tarjeta, setTarjeta] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate(`/cliente/login?negocio=${negocioId}`); return }

      const { data: clienteData } = await supabase
        .from('clientes').select('*').eq('user_id', user.id).single()

      const { data: negocioData } = await supabase
        .from('negocios').select('*').eq('id', negocioId).single()
      setNegocio(negocioData)

      const { data: tarjetaData } = await supabase
        .from('tarjetas').select('*')
        .eq('cliente_id', clienteData?.id)
        .eq('negocio_id', negocioId)
        .single()
      setTarjeta(tarjetaData)

      setLoading(false)
    }
    init()
  }, [negocioId, navigate])

  useEffect(() => {
    if (!tarjeta) return
    const channel = supabase
      .channel('tarjeta-cambios')
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'tarjetas',
        filter: `id=eq.${tarjeta.id}`,
      }, (payload) => setTarjeta(payload.new))
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [tarjeta])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate(`/cliente/login?negocio=${negocioId}`)
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #bf360c 0%, #E65100 60%, #d4380a 100%)' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>Cargando tu tarjeta...</p>
    </div>
  )

  const diseno = negocio?.diseno || {}
  const premios = Array.isArray(negocio?.premios) && negocio.premios.length > 0
    ? negocio.premios
    : [{ sellos: negocio?.num_sellos || 10, texto: negocio?.premio || '' }]

  // Resolver paths de iconos desde el diseño guardado
  const selloIconId = diseno?.selloIcon || 'check'
  const premioIconId = diseno?.premioIcon || 'gift'
  const selloPath = ICONOS_SELLO[negocio?.tipo] || ICONOS_SELLO.default
  const premioPath = ICONOS_PREMIO[premioIconId] || ICONOS_PREMIO.gift

  const disenoConPaths = { ...diseno, selloPath, premioPath }

  const sellosActuales = tarjeta?.sellos_actuales || 0
  const totalSellos = negocio?.num_sellos || 10
  const premioGanado = sellosActuales >= totalSellos
  const qrCliente = premioGanado
    ? `${window.location.origin}/negocio/canjear?tarjeta=${tarjeta?.id}`
    : `${window.location.origin}/negocio/escanear?tarjeta=${tarjeta?.id}`

  const tarjetaProps = {
    diseno: disenoConPaths,
    nombre: negocio?.nombre,
    totalSellos,
    sellosActuales,
    premios,
    qrCliente,
    premioGanado,
  }

  return (
    <div style={s.root}>
      <button onClick={handleLogout} style={s.salirBtn}>Salir</button>
      <div style={s.wrapper}>
        {diseno?.estilo === 'dark'
          ? <TarjetaClasico {...tarjetaProps} />
          : <TarjetaModerno {...tarjetaProps} />
        }
      </div>
    </div>
  )
}

const s = {
  root: {
    minHeight: '100dvh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  salirBtn: {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '20px',
    padding: '4px 14px',
    fontSize: '0.8rem',
    color: '#888',
    cursor: 'pointer',
    zIndex: 100,
  },
  wrapper: {
    width: '100%',
    maxWidth: '420px',
    marginTop: '3.5rem',
    boxSizing: 'border-box',
  },
}