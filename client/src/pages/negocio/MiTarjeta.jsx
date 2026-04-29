import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import NavNegocio from '../../components/NavNegocio'

const ESTILOS = [
  { id: 'blob', nombre: 'Blob', desc: 'Burbujas suaves' },
  { id: 'split', nombre: 'Split', desc: 'Zona superior + QR' },
  { id: 'glass', nombre: 'Glass', desc: 'Cristal oscuro' },
  { id: 'neon', nombre: 'Neón', desc: 'Fondo negro + luz' },
  { id: 'dark-green', nombre: 'Forest', desc: 'Verde oscuro' },
  { id: 'minimal', nombre: 'Minimal', desc: 'Limpio y claro' },
]

const EFECTOS = [
  { id: 'bubbles', nombre: 'Burbujas' },
  { id: 'none', nombre: 'Sin efecto' },
  { id: 'lines', nombre: 'Líneas' },
  { id: 'dots', nombre: 'Puntos' },
  { id: 'waves', nombre: 'Ondas' },
  { id: 'hexagons', nombre: 'Hexágonos' },
  { id: 'gradient', nombre: 'Gradiente' },
  { id: 'confetti', nombre: 'Confeti' },
]

const COLORES = [
  '#E8763A', '#1C1C1E', '#B71C1C', '#1565C0', '#2D6A4F',
  '#6B2D6B', '#C2185B', '#5C4033', '#C67C3E', '#5C6BC0',
  '#00838F', '#558B2F', '#E65100', '#4527A0', '#1A237E',
  '#880E4F', '#006064', '#33691E', '#F57F17', '#37474F',
]

const SELLOS_ICONOS = [
  { id: 'check', label: '✓', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> },
  { id: 'star', label: '★', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
  { id: 'heart', label: '♥', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { id: 'circle', label: '●', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg> },
  { id: 'bolt', label: '⚡', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { id: 'diamond', label: '◆', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10z"/></svg> },
]

const PREMIOS_ICONOS = [
  { id: 'gift', label: '🎁', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> },
  { id: 'trophy', label: '🏆', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg> },
  { id: 'crown', label: '👑', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19l2-9 5 5 3-10 3 10 5-5 2 9H2z"/></svg> },
  { id: 'medal', label: '🥇', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="15" r="6"/><path d="M8.56 2.9A7 7 0 0 1 17 6l2 2-2 1"/><path d="M7 6l-2 2 2 1"/><text x="9" y="19" fontSize="7" fontWeight="bold" fill="currentColor">1</text></svg> },
]

// Renderizar efecto decorativo sobre la tarjeta
function EfectoDecorativo({ efecto, color }) {
  const c = color || '#E8763A'
  if (efecto === 'bubbles') return (
    <>
      <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', top: -50, right: -50, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', bottom: -30, left: -30, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,215,0,0.1)', bottom: 60, right: 20, pointerEvents: 'none' }} />
    </>
  )
  if (efecto === 'lines') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.08 }} viewBox="0 0 300 200">
      {[0,1,2,3,4,5].map(i => <line key={i} x1={i*60-30} y1="0" x2={i*60+30} y2="200" stroke="#fff" strokeWidth="1"/>)}
    </svg>
  )
  if (efecto === 'dots') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.12 }} viewBox="0 0 300 200">
      {[0,1,2,3,4,5,6,7,8,9].map(x => [0,1,2,3,4,5].map(y => (
        <circle key={`${x}-${y}`} cx={x*34+10} cy={y*34+10} r="2.5" fill="#fff"/>
      )))}
    </svg>
  )
  if (efecto === 'waves') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }} viewBox="0 0 300 200" preserveAspectRatio="none">
      <path d="M0,60 Q75,40 150,60 Q225,80 300,60 L300,200 L0,200 Z" fill="#fff"/>
      <path d="M0,100 Q75,80 150,100 Q225,120 300,100 L300,200 L0,200 Z" fill="#fff"/>
    </svg>
  )
  if (efecto === 'hexagons') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.08 }} viewBox="0 0 300 200">
      {[[50,50],[150,50],[250,50],[100,100],[200,100],[50,150],[150,150],[250,150]].map(([cx,cy],i) => (
        <polygon key={i} points={`${cx},${cy-20} ${cx+17},${cy-10} ${cx+17},${cy+10} ${cx},${cy+20} ${cx-17},${cy+10} ${cx-17},${cy-10}`} fill="none" stroke="#fff" strokeWidth="1"/>
      ))}
    </svg>
  )
  if (efecto === 'gradient') return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)', pointerEvents: 'none' }} />
  )
  if (efecto === 'confetti') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.15 }} viewBox="0 0 300 200">
      {[[20,20],[80,40],[140,15],[200,35],[260,20],[40,80],[100,70],[160,90],[220,75],[280,85],[30,140],[90,160],[150,135],[210,155],[270,140]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="6" height="6" rx="1" fill="#fff" transform={`rotate(${i*23} ${x+3} ${y+3})`}/>
      ))}
    </svg>
  )
  return null
}

// Preview de tarjeta según estilo
function PreviewTarjeta({ estilo, efecto, color, nombre, numSellos, premio, selloIconId, premioIconId }) {
  const col = color || '#E8763A'
  const selloIcon = SELLOS_ICONOS.find(s => s.id === selloIconId) || SELLOS_ICONOS[0]
  const premioIcon = PREMIOS_ICONOS.find(p => p.id === premioIconId) || PREMIOS_ICONOS[0]

  const Sellos = ({ n, marcados, dark }) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(5, 1fr)`, gap: '6px' }}>
      {Array.from({ length: Math.min(n, 10) }).map((_, i) => {
        const marcado = i < marcados
        const esUltimo = i === n - 1
        return (
          <div key={i} style={{
            aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: marcado ? (esUltimo ? '#FFD700' : (dark ? 'rgba(255,255,255,0.85)' : '#fff')) : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'),
            border: marcado ? 'none' : `1.5px solid ${dark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.35)'}`,
            color: marcado ? (esUltimo ? col : col) : 'transparent',
          }}>
            {marcado && (esUltimo
              ? <span style={{ color: col }}>{premioIcon.svg}</span>
              : <span style={{ color: col }}>{selloIcon.svg}</span>
            )}
          </div>
        )
      })}
    </div>
  )

  if (estilo === 'blob') return (
    <div style={{ borderRadius: '20px', background: col, padding: '1.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
      <EfectoDecorativo efecto={efecto} color={col} />
      <h3 style={{ margin: '0 0 0.75rem', color: '#fff', fontStyle: 'italic', fontFamily: 'Georgia,serif', fontSize: '1.1rem', position: 'relative', zIndex: 1 }}>{nombre || 'Tu negocio'}</h3>
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '0.75rem' }}><Sellos n={numSellos} marcados={3} /></div>
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '5px 10px' }}>
        <p style={{ margin: 0, fontSize: '11px', color: '#fff' }}>🎁 {premio || 'Premio'}</p>
      </div>
    </div>
  )

  if (estilo === 'split') return (
    <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
      <div style={{ background: col, padding: '1rem', position: 'relative', overflow: 'hidden' }}>
        <EfectoDecorativo efecto={efecto} color={col} />
        <h3 style={{ margin: '0 0 0.75rem', color: '#fff', fontStyle: 'italic', fontFamily: 'Georgia,serif', fontSize: '1rem', position: 'relative', zIndex: 1 }}>{nombre || 'Tu negocio'}</h3>
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '6px' }}><Sellos n={numSellos} marcados={3} /></div>
        <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.8)', position: 'relative', zIndex: 1 }}>3 / {numSellos} sellos</p>
      </div>
      <div style={{ background: '#fff', padding: '0.75rem', textAlign: 'center' }}>
        <p style={{ margin: '0 0 4px', fontSize: '9px', color: '#aaa', letterSpacing: '0.08em' }}>TU CÓDIGO PERSONAL</p>
        <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '8px', display: 'inline-block' }}>
          <div style={{ width: 55, height: 55, background: '#1C1C1E', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  )

  if (estilo === 'glass') return (
    <div style={{ borderRadius: '20px', background: '#1a1030', padding: '1.25rem', border: '1px solid rgba(127,119,221,0.3)', position: 'relative', overflow: 'hidden' }}>
      <EfectoDecorativo efecto={efecto} color={col} />
      <h3 style={{ margin: '0 0 0.75rem', color: '#fff', fontStyle: 'italic', fontFamily: 'Georgia,serif', fontSize: '1rem', position: 'relative', zIndex: 1 }}>{nombre || 'Tu negocio'}</h3>
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(127,119,221,0.15)', borderRadius: '8px', padding: '8px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>SELLOS</p>
          <p style={{ margin: 0, fontSize: '9px', color: '#fff' }}>3 / {numSellos}</p>
        </div>
        <div style={{ display: 'flex', gap: '3px' }}>
          {Array.from({ length: numSellos }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: '5px', borderRadius: '3px', background: i < 3 ? '#7F77DD' : 'rgba(127,119,221,0.2)' }} />
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '6px', textAlign: 'center' }}>
        <div style={{ width: 50, height: 50, background: 'rgba(127,119,221,0.3)', borderRadius: '4px', margin: '0 auto' }} />
      </div>
    </div>
  )

  if (estilo === 'neon') return (
    <div style={{ borderRadius: '20px', background: '#0a0a0a', padding: '1.25rem', border: `1px solid ${col}44`, position: 'relative', overflow: 'hidden' }}>
      <EfectoDecorativo efecto={efecto} color={col} />
      <h3 style={{ margin: '0 0 0.75rem', color: col, fontStyle: 'italic', fontFamily: 'Georgia,serif', fontSize: '1rem', position: 'relative', zIndex: 1 }}>{nombre || 'Tu negocio'}</h3>
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '6px' }}>
          {Array.from({ length: Math.min(numSellos, 10) }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: '6px', background: i < 3 ? `${col}33` : 'rgba(255,255,255,0.05)', border: i < 3 ? `1px solid ${col}` : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: col }}>
              {i < 3 && <span>{selloIcon.svg}</span>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, background: `${col}22`, border: `1px solid ${col}55`, borderRadius: '8px', padding: '6px', textAlign: 'center' }}>
        <div style={{ width: 50, height: 50, background: `${col}33`, borderRadius: '4px', margin: '0 auto' }} />
      </div>
    </div>
  )

  if (estilo === 'dark-green') return (
    <div style={{ borderRadius: '20px', background: '#0d2818', padding: '1.25rem', border: '1px solid rgba(45,106,79,0.4)', position: 'relative', overflow: 'hidden' }}>
      <EfectoDecorativo efecto={efecto} color={col} />
      <h3 style={{ margin: '0 0 0.75rem', color: '#fff', fontStyle: 'italic', fontFamily: 'Georgia,serif', fontSize: '1rem', position: 'relative', zIndex: 1 }}>{nombre || 'Tu negocio'}</h3>
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
          {Array.from({ length: numSellos }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: '5px', borderRadius: '3px', background: i < 3 ? '#2D6A4F' : 'rgba(45,106,79,0.2)' }} />
          ))}
        </div>
        <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>3 / {numSellos} sellos</p>
      </div>
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(45,106,79,0.3)', borderRadius: '8px', padding: '6px', textAlign: 'center' }}>
        <div style={{ width: 50, height: 50, background: 'rgba(45,106,79,0.5)', borderRadius: '4px', margin: '0 auto' }} />
      </div>
    </div>
  )

  // minimal
  return (
    <div style={{ borderRadius: '20px', background: '#fff', padding: '1.25rem', border: `2px solid ${col}`, position: 'relative', overflow: 'hidden' }}>
      <EfectoDecorativo efecto={efecto} color={col} />
      <h3 style={{ margin: '0 0 0.75rem', color: '#1C1C1E', fontSize: '1rem', fontFamily: 'Georgia,serif', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>{nombre || 'Tu negocio'}</h3>
      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '6px', marginBottom: '0.75rem' }}>
        {Array.from({ length: Math.min(numSellos, 10) }).map((_, i) => (
          <div key={i} style={{ aspectRatio: '1', borderRadius: '50%', background: i < 3 ? col : '#f5f5f5', border: i < 3 ? 'none' : `1.5px solid #e0e0e0`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            {i < 3 && <span>{selloIcon.svg}</span>}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', zIndex: 1, background: '#f9f9f9', borderRadius: '8px', padding: '6px', textAlign: 'center' }}>
        <div style={{ width: 50, height: 50, background: '#e0e0e0', borderRadius: '4px', margin: '0 auto' }} />
      </div>
    </div>
  )
}

export default function MiTarjeta() {
  const [negocio, setNegocio] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('diseno')
  const [estilo, setEstilo] = useState('blob')
  const [efecto, setEfecto] = useState('bubbles')
  const [color, setColor] = useState('#E8763A')
  const [selloIconId, setSelloIconId] = useState('check')
  const [premioIconId, setPremioIconId] = useState('gift')
  const [numSellos, setNumSellos] = useState(10)
  const [premio, setPremio] = useState('')
  const [caducidad, setCaducidad] = useState(12)
  const [error, setError] = useState('')
  const [guardado, setGuardado] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/negocio/login'); return }
      setUser(user)
      const { data } = await supabase.from('negocios').select('*').eq('user_id', user.id).single()
      if (!data) { navigate('/negocio/onboarding'); return }
      setNegocio(data)
      setNumSellos(data.num_sellos || 10)
      setPremio(data.premio || '')
      setCaducidad(data.caducidad_meses || 12)
      if (data.diseno && Object.keys(data.diseno).length > 0) {
        setEstilo(data.diseno.estilo || 'blob')
        setEfecto(data.diseno.efecto || 'bubbles')
        setColor(data.diseno.color || '#E8763A')
        setSelloIconId(data.diseno.selloIcon || 'check')
        setPremioIconId(data.diseno.premioIcon || 'gift')
      }
      setLoading(false)
    }
    init()
  }, [navigate])

  const handleGuardar = async () => {
    setError('')
    if (!premio.trim()) { setError('Define el premio para tu cliente'); return }
    setSaving(true)
    const { error: e } = await supabase.from('negocios').update({
      num_sellos: numSellos,
      premio,
      caducidad_meses: caducidad,
      diseno: { estilo, efecto, color, selloIcon: selloIconId, premioIcon: premioIconId },
    }).eq('user_id', user.id)
    setSaving(false)
    if (e) { setError('Error al guardar: ' + e.message) }
    else { setGuardado(true); setTimeout(() => setGuardado(false), 2500) }
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
    </div>
  )

  return (
    <div style={styles.root}>
      <NavNegocio negocio={negocio} user={user} />
      <main style={styles.main}>
        <div style={styles.inner}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h1 style={styles.titulo}>Mi Tarjeta</h1>
            <p style={styles.subtitulo}>Personaliza el diseño y configuración de tu tarjeta</p>
          </div>

          <div style={styles.layout}>

            {/* Columna izquierda — controles */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Tabs */}
              <div style={styles.tabs}>
                {['diseno', 'config'].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    ...styles.tab,
                    borderBottom: tab === t ? '2px solid #E8763A' : '2px solid transparent',
                    color: tab === t ? '#E8763A' : '#888',
                  }}>
                    {t === 'diseno' ? 'Diseño' : 'Configuración'}
                  </button>
                ))}
              </div>

              {tab === 'diseno' && (
                <div>
                  <p style={styles.secLabel}>Estilo de tarjeta</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.25rem' }}>
                    {ESTILOS.map(e => (
                      <button key={e.id} onClick={() => setEstilo(e.id)} style={{
                        padding: '0.6rem 0.5rem', borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
                        border: estilo === e.id ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                        backgroundColor: estilo === e.id ? '#FFF4EE' : '#fafafa',
                      }}>
                        <p style={{ margin: '0 0 2px', fontSize: '0.82rem', fontWeight: '600', color: '#1C1C1E' }}>{e.nombre}</p>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#888' }}>{e.desc}</p>
                      </button>
                    ))}
                  </div>

                  <p style={styles.secLabel}>Efecto decorativo</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '1.25rem' }}>
                    {EFECTOS.map(e => (
                      <button key={e.id} onClick={() => setEfecto(e.id)} style={{
                        padding: '0.5rem 0.25rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '0.75rem',
                        border: efecto === e.id ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                        backgroundColor: efecto === e.id ? '#FFF4EE' : '#fafafa',
                        color: efecto === e.id ? '#E8763A' : '#555',
                        fontWeight: efecto === e.id ? '600' : '400',
                      }}>
                        {e.nombre}
                      </button>
                    ))}
                  </div>

                  <p style={styles.secLabel}>Color</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
                    {COLORES.map(c => (
                      <button key={c} onClick={() => setColor(c)} style={{
                        width: 30, height: 30, borderRadius: '50%', backgroundColor: c, cursor: 'pointer',
                        border: color === c ? '3px solid #E8763A' : '2px solid transparent',
                        outline: color === c ? '2px solid #e8e8e8' : 'none',
                      }} />
                    ))}
                  </div>

                  <p style={styles.secLabel}>Icono de sello</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {SELLOS_ICONOS.map(s => (
                      <button key={s.id} onClick={() => setSelloIconId(s.id)} style={{
                        width: 40, height: 40, borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: selloIconId === s.id ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                        backgroundColor: selloIconId === s.id ? '#FFF4EE' : '#fafafa',
                        color: selloIconId === s.id ? '#E8763A' : '#555',
                      }}>
                        {s.svg}
                      </button>
                    ))}
                  </div>

                  <p style={styles.secLabel}>Icono de premio</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {PREMIOS_ICONOS.map(p => (
                      <button key={p.id} onClick={() => setPremioIconId(p.id)} style={{
                        width: 40, height: 40, borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: premioIconId === p.id ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                        backgroundColor: premioIconId === p.id ? '#FFF4EE' : '#fafafa',
                        color: premioIconId === p.id ? '#E8763A' : '#555',
                      }}>
                        {p.svg}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'config' && (
                <div>
                  <p style={styles.secLabel}>Sellos para el premio</p>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <input type="range" min="5" max="20" value={numSellos} onChange={e => setNumSellos(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#E8763A' }}>{numSellos}</span>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>sellos</span>
                    </div>
                  </div>

                  <p style={styles.secLabel}>Premio</p>
                  <input type="text" placeholder="Ej: 1 corte de pelo gratis" value={premio} onChange={e => setPremio(e.target.value)} style={styles.input} />

                  <p style={styles.secLabel}>Caducidad</p>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <input type="range" min="6" max="24" value={caducidad} onChange={e => setCaducidad(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#E8763A' }}>{caducidad}</span>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>meses</span>
                    </div>
                  </div>

                  {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{error}</p>}
                </div>
              )}

              <button onClick={handleGuardar} disabled={saving} style={{
                padding: '0.9rem', width: '100%',
                backgroundColor: guardado ? '#2D6A4F' : '#E8763A',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer',
                marginTop: '1.5rem', transition: 'background-color 0.3s',
              }}>
                {saving ? 'Guardando...' : guardado ? '✓ Guardado' : 'Guardar cambios'}
              </button>
            </div>

            {/* Preview */}
            <div style={{ width: '100%', maxWidth: 260, flexShrink: 0 }}>
              <p style={styles.secLabel}>Vista previa</p>
              <PreviewTarjeta
                estilo={estilo}
                efecto={efecto}
                color={color}
                nombre={negocio?.nombre}
                numSellos={numSellos}
                premio={premio}
                selloIconId={selloIconId}
                premioIconId={premioIconId}
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  root: { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  main: { flex: 1, overflowY: 'auto', padding: '2rem 1.25rem' },
  inner: { maxWidth: 900, margin: '0 auto' },
  titulo: { margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo: { margin: 0, fontSize: '0.9rem', color: '#888' },
  layout: { display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' },
  tabs: { display: 'flex', borderBottom: '1px solid #e8e8e8', marginBottom: '1.25rem' },
  tab: { padding: '0.65rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' },
  secLabel: { fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.6rem' },
  input: {
    padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8',
    fontSize: '0.9rem', outline: 'none', backgroundColor: '#fafafa',
    color: '#1C1C1E', width: '100%', boxSizing: 'border-box', marginBottom: '1.25rem',
  },
}