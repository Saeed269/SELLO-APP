import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import NavNegocio from '../../components/NavNegocio'
import LoadingScreen from '../../components/ui/LoadingScreen'
import TarjetaPreview from '../../components/tarjeta/TarjetaPreview'
import { CARD_STYLES, CARD_EFFECTS, COLOR_PALETTE, DEFAULT_CARD } from '../../constants'

// ─── Icono SVG inline simple ──────────────────────────────────
function IconSVG({ path, circle, size = 14, color = 'currentColor' }) {
  const circleEl = circle
    ? `<circle cx="${circle.split(' ')[0]}" cy="${circle.split(' ')[1]}" r="${circle.split(' ')[2]}"/>`
    : ''
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: circleEl + `<path d="${path}"/>` }}
    />
  )
}

// ─── Datos de iconos ──────────────────────────────────────────
const ICONOS_SELLO_POR_TIPO = {
  'Cafetería': [
    { id: 'cup',     label: 'Taza',     path: 'M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z' },
    { id: 'bean',    label: 'Grano',    path: 'M10.5 14.5c-2-2-3-4.5-2.5-7 .5-3 3-5 5.5-5s5 2 5 5-2 5-5 5c-2.5.5-5-1-7-3' },
    { id: 'star',    label: 'Estrella', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  ],
  'Restaurante': [
    { id: 'flame',   label: 'Llama',    path: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' },
    { id: 'heart',   label: 'Corazón',  path: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' },
    { id: 'star',    label: 'Estrella', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  ],
  'Panadería & Pastelería': [
    { id: 'heart',   label: 'Corazón',  path: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' },
    { id: 'star',    label: 'Estrella', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { id: 'sparkle', label: 'Brillo',   path: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' },
  ],
  'Peluquería & Barbería': [
    { id: 'scissors', label: 'Tijeras', path: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 4 8.12 15.88M8.12 8.12 12 12m7.88 7.88L12 12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
    { id: 'sparkle',  label: 'Brillo',  path: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' },
    { id: 'star',     label: 'Estrella', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  ],
  'Manicura & Estética': [
    { id: 'sparkle', label: 'Brillo',   path: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' },
    { id: 'heart',   label: 'Corazón',  path: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' },
    { id: 'star',    label: 'Estrella', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  ],
  'Masajes & Spa': [
    { id: 'leaf',    label: 'Hoja',     path: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' },
    { id: 'droplet', label: 'Gota',     path: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z' },
    { id: 'heart',   label: 'Corazón',  path: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' },
  ],
  'Yoga & Pilates': [
    { id: 'sun',     label: 'Sol',      path: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41', circle: '12 12 4' },
    { id: 'leaf',    label: 'Hoja',     path: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' },
    { id: 'heart',   label: 'Corazón',  path: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' },
  ],
  'Entrenador Personal': [
    { id: 'bolt',    label: 'Rayo',     path: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z' },
    { id: 'flame',   label: 'Llama',    path: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' },
    { id: 'star',    label: 'Estrella', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  ],
  default: [
    { id: 'check',   label: 'Check',    path: 'M20 6L9 17l-5-5' },
    { id: 'star',    label: 'Estrella', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { id: 'heart',   label: 'Corazón',  path: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' },
    { id: 'bolt',    label: 'Rayo',     path: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z' },
    { id: 'sparkle', label: 'Brillo',   path: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' },
  ],
}

const ICONOS_PREMIO = [
  { id: 'gift',    path: 'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z' },
  { id: 'trophy',  path: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z' },
  { id: 'star',    path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { id: 'crown',   path: 'M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294zM5 21h14' },
  { id: 'sparkle', path: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' },
]

// ─── Helpers ──────────────────────────────────────────────────
function generarPremios(cantidad, numSellos) {
  return Array.from({ length: cantidad }, (_, i) => ({
    sellos: Math.round((numSellos / cantidad) * (i + 1)),
    texto: '',
  }))
}

// ─── Subcomponentes de UI ─────────────────────────────────────
function TabBar({ tab, onChange }) {
  return (
    <div style={s.tabs}>
      {[['diseno', 'Diseño'], ['config', 'Configuración']].map(([id, label]) => (
        <button key={id} onClick={() => onChange(id)} style={{
          ...s.tab,
          borderBottom: tab === id ? '2px solid #E65100' : '2px solid transparent',
          color: tab === id ? '#E65100' : '#888',
        }}>
          {label}
        </button>
      ))}
    </div>
  )
}

function SecLabel({ children }) {
  return <p style={s.secLabel}>{children}</p>
}

// ─── Página principal ─────────────────────────────────────────
export default function MiTarjeta() {
  const [negocio, setNegocio]         = useState(null)
  const [user, setUser]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [tab, setTab]                 = useState('diseno')
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 768)
  const [estilo, setEstilo]           = useState(DEFAULT_CARD.estilo)
  const [efecto, setEfecto]           = useState(DEFAULT_CARD.efecto)
  const [color, setColor]             = useState(DEFAULT_CARD.color)
  const [selloIconId, setSelloIconId] = useState(DEFAULT_CARD.selloIcon)
  const [premioIconId, setPremioIconId] = useState(DEFAULT_CARD.premioIcon)
  const [numSellos, setNumSellos]     = useState(10)
  const [numPremios, setNumPremios]   = useState(1)
  const [premios, setPremios]         = useState([{ sellos: 10, texto: '' }])
  const [caducidad, setCaducidad]     = useState(12)
  const [error, setError]             = useState('')
  const [guardado, setGuardado]       = useState(false)
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
      if (!data) { navigate('/negocio/onboarding'); return }
      setNegocio(data)
      setNumSellos(data.num_sellos || 10)
      setCaducidad(data.caducidad_meses || 12)

      if (Array.isArray(data.premios) && data.premios.length > 0) {
        setPremios(data.premios)
        setNumPremios(data.premios.length)
      } else if (data.premio) {
        setPremios([{ sellos: data.num_sellos || 10, texto: data.premio }])
      }

      if (data.diseno && Object.keys(data.diseno).length > 0) {
        setEstilo(data.diseno.estilo || DEFAULT_CARD.estilo)
        setEfecto(data.diseno.efecto || DEFAULT_CARD.efecto)
        setColor(data.diseno.color || DEFAULT_CARD.color)
        setSelloIconId(data.diseno.selloIcon || DEFAULT_CARD.selloIcon)
        setPremioIconId(data.diseno.premioIcon || DEFAULT_CARD.premioIcon)
      }

      setLoading(false)
    }
    init()
  }, [navigate])

  const handleNumPremiosChange = (n) => {
    setNumPremios(n)
    const nuevos = generarPremios(n, numSellos)
    setPremios(prev => nuevos.map((p, i) => ({ ...p, texto: prev[i]?.texto || '' })))
  }

  const handleNumSellosChange = (val) => {
    setNumSellos(val)
    const nuevos = generarPremios(numPremios, val)
    setPremios(prev => nuevos.map((p, i) => ({ ...p, texto: prev[i]?.texto || '' })))
  }

  const handleGuardar = async () => {
    setError('')
    if (premios.some(p => !p.texto.trim())) { setError('Define el texto de todos los premios'); return }
    setSaving(true)
    const { error: e } = await supabase.from('negocios').update({
      num_sellos: numSellos,
      premio: premios[premios.length - 1]?.texto || '',
      caducidad_meses: caducidad,
      premios,
      diseno: { estilo, efecto, color, selloIcon: selloIconId, premioIcon: premioIconId },
    }).eq('user_id', user.id)
    setSaving(false)
    if (e) { setError('Error al guardar: ' + e.message) }
    else { setGuardado(true); setTimeout(() => setGuardado(false), 2500) }
  }

  if (loading) return <LoadingScreen />

  const iconosSello  = ICONOS_SELLO_POR_TIPO[negocio?.tipo] || ICONOS_SELLO_POR_TIPO.default
  const selloIcon    = iconosSello.find(i => i.id === selloIconId) || iconosSello[0]
  const premioIcon   = ICONOS_PREMIO.find(i => i.id === premioIconId) || ICONOS_PREMIO[0]
  const qrCliente    = `${window.location.origin}/negocio/escanear?tarjeta=preview`
  const previewProps = { estilo, efecto, color, nombre: negocio?.nombre, numSellos, premios, selloIcon, premioIcon, qrUrl: qrCliente }

  const renderDiseno = () => (
    <div>
      <SecLabel>Estilo de tarjeta</SecLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '1.25rem' }}>
        {CARD_STYLES.map(e => (
          <button key={e.id} onClick={() => setEstilo(e.id)} style={{ padding: '0.75rem', borderRadius: '10px', cursor: 'pointer', textAlign: 'center', border: estilo === e.id ? '2px solid #E65100' : '1.5px solid #e8e8e8', backgroundColor: estilo === e.id ? '#FFF4EE' : '#fafafa' }}>
            <p style={{ margin: '0 0 2px', fontSize: '0.88rem', fontWeight: '600', color: '#1C1C1E' }}>{e.nombre}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>{e.desc}</p>
          </button>
        ))}
      </div>

      <SecLabel>Efecto decorativo</SecLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px', marginBottom: '1.25rem' }}>
        {CARD_EFFECTS.map(e => (
          <button key={e.id} onClick={() => setEfecto(e.id)} style={{ padding: '0.45rem 0.2rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '0.73rem', border: efecto === e.id ? '2px solid #E65100' : '1.5px solid #e8e8e8', backgroundColor: efecto === e.id ? '#FFF4EE' : '#fafafa', color: efecto === e.id ? '#E65100' : '#555', fontWeight: efecto === e.id ? '600' : '400' }}>
            {e.nombre}
          </button>
        ))}
      </div>

      <SecLabel>Color</SecLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
        {COLOR_PALETTE.map(c => (
          <button key={c} onClick={() => setColor(c)} style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: c, cursor: 'pointer', border: color === c ? '3px solid #E65100' : '2px solid transparent', outline: color === c ? '2px solid #e8e8e8' : 'none' }} />
        ))}
      </div>

      <SecLabel>Icono de sello</SecLabel>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {iconosSello.map(ico => (
          <button key={ico.id} onClick={() => setSelloIconId(ico.id)} style={{ width: 44, height: 44, borderRadius: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', border: selloIconId === ico.id ? '2px solid #E65100' : '1.5px solid #e8e8e8', backgroundColor: selloIconId === ico.id ? '#FFF4EE' : '#fafafa' }}>
            <IconSVG path={ico.path} circle={ico.circle} size={16} color={selloIconId === ico.id ? '#E65100' : '#555'} />
            <span style={{ fontSize: '0.58rem', color: '#888' }}>{ico.label}</span>
          </button>
        ))}
      </div>

      <SecLabel>Icono de premio</SecLabel>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {ICONOS_PREMIO.map(ico => (
          <button key={ico.id} onClick={() => setPremioIconId(ico.id)} style={{ width: 44, height: 44, borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: premioIconId === ico.id ? '2px solid #E65100' : '1.5px solid #e8e8e8', backgroundColor: premioIconId === ico.id ? '#FFF4EE' : '#fafafa' }}>
            <IconSVG path={ico.path} size={16} color={premioIconId === ico.id ? '#E65100' : '#555'} />
          </button>
        ))}
      </div>
    </div>
  )

  const renderConfig = () => (
    <div>
      <SecLabel>Total de sellos</SecLabel>
      <div style={{ marginBottom: '1.25rem' }}>
        <input type="range" min="5" max="20" value={numSellos} onChange={e => handleNumSellosChange(Number(e.target.value))} style={{ width: '100%' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#E65100' }}>{numSellos}</span>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>sellos</span>
        </div>
      </div>

      <SecLabel>Número de premios</SecLabel>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        {[1, 2].map(n => (
          <button key={n} onClick={() => handleNumPremiosChange(n)} style={{ width: 44, height: 44, borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', border: numPremios === n ? '2px solid #E65100' : '1.5px solid #e8e8e8', backgroundColor: numPremios === n ? '#FFF4EE' : '#fafafa', color: numPremios === n ? '#E65100' : '#555' }}>
            {n}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
        {premios.map((p, i) => (
          <div key={i} style={{ background: '#fafafa', border: '1.5px solid #e8e8e8', borderRadius: '12px', padding: '0.75rem' }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.78rem', fontWeight: '600', color: '#E65100' }}>
              {i === premios.length - 1 ? `Premio final — ${p.sellos} sellos` : `Premio intermedio — ${p.sellos} sellos`}
            </p>
            <input type="text" placeholder={i === 0 && premios.length > 1 ? 'Ej: Café pequeño gratis' : 'Ej: Menú completo gratis'} value={p.texto} onChange={e => setPremios(prev => prev.map((pr, idx) => idx === i ? { ...pr, texto: e.target.value } : pr))} style={s.input} />
          </div>
        ))}
      </div>

      <SecLabel>Caducidad</SecLabel>
      <div style={{ marginBottom: '1.5rem' }}>
        <input type="range" min="6" max="24" value={caducidad} onChange={e => setCaducidad(Number(e.target.value))} style={{ width: '100%' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#E65100' }}>{caducidad}</span>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>meses</span>
        </div>
      </div>

      {error && <p style={{ color: '#d4380a', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{error}</p>}
    </div>
  )

  const btnGuardar = (
    <button onClick={handleGuardar} disabled={saving} style={{ padding: '0.9rem', width: '100%', backgroundColor: guardado ? '#2D6A4F' : '#E65100', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', marginTop: '1.5rem' }}>
      {saving ? 'Guardando...' : guardado ? '✓ Guardado' : 'Guardar cambios'}
    </button>
  )

  return (
    <div style={s.root}>
      <NavNegocio negocio={negocio} user={user} />
      <main style={s.main}>
        <div style={s.inner}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h1 style={s.titulo}>Mi Tarjeta</h1>
            <p style={s.subtitulo}>Personaliza el diseño de tu tarjeta de fidelización</p>
          </div>

          {isMobile ? (
            <div>
              <TabBar tab={tab} onChange={setTab} />
              {tab === 'diseno' ? renderDiseno() : renderConfig()}
              <div style={{ marginTop: '1.5rem' }}>
                <SecLabel>Vista previa</SecLabel>
                <TarjetaPreview {...previewProps} />
              </div>
              {btnGuardar}
            </div>
          ) : (
            <div style={s.layout}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <TabBar tab={tab} onChange={setTab} />
                {tab === 'diseno' ? renderDiseno() : renderConfig()}
                {btnGuardar}
              </div>
              <div style={{ width: 240, flexShrink: 0 }}>
                <SecLabel>Vista previa</SecLabel>
                <div style={{ maxWidth: 240 }}>
                  <TarjetaPreview {...previewProps} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

const s = {
  root:      { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  main:      { flex: 1, overflowY: 'auto', padding: '2rem 1.25rem' },
  inner:     { maxWidth: 900, margin: '0 auto' },
  titulo:    { margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo: { margin: 0, fontSize: '0.9rem', color: '#888' },
  layout:    { display: 'flex', gap: '2rem', alignItems: 'flex-start' },
  tabs:      { display: 'flex', borderBottom: '1px solid #e8e8e8', marginBottom: '1.25rem' },
  tab:       { padding: '0.65rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' },
  secLabel:  { fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.6rem' },
  input:     { padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8', fontSize: '0.9rem', outline: 'none', backgroundColor: '#fff', color: '#1C1C1E', width: '100%', boxSizing: 'border-box' },
}