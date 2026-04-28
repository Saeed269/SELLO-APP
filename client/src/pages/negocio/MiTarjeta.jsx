import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import NavNegocio from '../../components/NavNegocio'

// Diseños por tipo de negocio
const DISENOS_POR_TIPO = {
  'Cafetería': [
    { id: 'cafe1', color: '#6B3F2A', sello: '☕', premio: '🎁', nombre: 'Clásico' },
    { id: 'cafe2', color: '#2D6A4F', sello: '🌿', premio: '🏆', nombre: 'Natural' },
    { id: 'cafe3', color: '#E8763A', sello: '✨', premio: '⭐', nombre: 'Vibrante' },
  ],
  'Restaurante': [
    { id: 'rest1', color: '#8B1A1A', sello: '🍽️', premio: '🎁', nombre: 'Elegante' },
    { id: 'rest2', color: '#1C3A5E', sello: '⭐', premio: '🏆', nombre: 'Premium' },
    { id: 'rest3', color: '#4A7C59', sello: '🍀', premio: '🎉', nombre: 'Fresco' },
  ],
  'Panadería & Pastelería': [
    { id: 'pan1', color: '#C67C3E', sello: '🥐', premio: '🎁', nombre: 'Dorado' },
    { id: 'pan2', color: '#8B4513', sello: '🍞', premio: '🏆', nombre: 'Rústico' },
    { id: 'pan3', color: '#D45A8A', sello: '🧁', premio: '⭐', nombre: 'Dulce' },
  ],
  'Peluquería & Barbería': [
    { id: 'pel1', color: '#1C1C1E', sello: '✂️', premio: '🎁', nombre: 'Urban' },
    { id: 'pel2', color: '#2C3E7A', sello: '💈', premio: '🏆', nombre: 'Classic' },
    { id: 'pel3', color: '#6B2D6B', sello: '✨', premio: '⭐', nombre: 'Premium' },
  ],
  'Manicura & Estética': [
    { id: 'man1', color: '#C2185B', sello: '💅', premio: '🎁', nombre: 'Rosa' },
    { id: 'man2', color: '#7B1FA2', sello: '✨', premio: '💎', nombre: 'Lila' },
    { id: 'man3', color: '#1C1C1E', sello: '🌸', premio: '⭐', nombre: 'Oscuro' },
  ],
  'Masajes & Spa': [
    { id: 'spa1', color: '#2D6A4F', sello: '🌿', premio: '🎁', nombre: 'Zen' },
    { id: 'spa2', color: '#5C4033', sello: '💆', premio: '🏆', nombre: 'Tierra' },
    { id: 'spa3', color: '#1A3A4A', sello: '🌊', premio: '⭐', nombre: 'Agua' },
  ],
  'Yoga & Pilates': [
    { id: 'yog1', color: '#5C6BC0', sello: '🧘', premio: '🎁', nombre: 'Calma' },
    { id: 'yog2', color: '#2D6A4F', sello: '🌿', premio: '⭐', nombre: 'Natural' },
    { id: 'yog3', color: '#E8763A', sello: '☀️', premio: '🏆', nombre: 'Energía' },
  ],
  'Entrenador Personal': [
    { id: 'ent1', color: '#1C1C1E', sello: '💪', premio: '🏆', nombre: 'Power' },
    { id: 'ent2', color: '#B71C1C', sello: '🔥', premio: '⭐', nombre: 'Fuego' },
    { id: 'ent3', color: '#1565C0', sello: '⚡', premio: '🎁', nombre: 'Storm' },
  ],
  'Lavandería': [
    { id: 'lav1', color: '#1565C0', sello: '👕', premio: '🎁', nombre: 'Fresco' },
    { id: 'lav2', color: '#00838F', sello: '💧', premio: '⭐', nombre: 'Agua' },
    { id: 'lav3', color: '#558B2F', sello: '🌿', premio: '🏆', nombre: 'Eco' },
  ],
  'Lavado de Coches': [
    { id: 'coc1', color: '#1565C0', sello: '🚗', premio: '🎁', nombre: 'Azul' },
    { id: 'coc2', color: '#1C1C1E', sello: '✨', premio: '🏆', nombre: 'Premium' },
    { id: 'coc3', color: '#2D6A4F', sello: '💧', premio: '⭐', nombre: 'Eco' },
  ],
  'Comercio': [
    { id: 'com1', color: '#E8763A', sello: '🛍️', premio: '🎁', nombre: 'Naranja' },
    { id: 'com2', color: '#1C1C1E', sello: '⭐', premio: '🏆', nombre: 'Oscuro' },
    { id: 'com3', color: '#1565C0', sello: '💙', premio: '🎉', nombre: 'Azul' },
  ],
  'Otro': [
    { id: 'otro1', color: '#E8763A', sello: '⭐', premio: '🎁', nombre: 'Naranja' },
    { id: 'otro2', color: '#1C1C1E', sello: '✨', premio: '🏆', nombre: 'Oscuro' },
    { id: 'otro3', color: '#5C6BC0', sello: '💫', premio: '⭐', nombre: 'Índigo' },
  ],
}

const COLORES_EXTRA = [
  '#E8763A', '#1C1C1E', '#B71C1C', '#1565C0', '#2D6A4F',
  '#6B2D6B', '#C2185B', '#5C4033', '#C67C3E', '#5C6BC0',
]

const SELLOS_OPCIONES = ['☕', '✂️', '💅', '🧘', '💪', '🛍️', '🚗', '🌿', '⭐', '✨', '🔥', '💧', '🥐', '🍽️', '💈']
const PREMIOS_OPCIONES = ['🎁', '🏆', '⭐', '🎉', '💎', '🌟', '🥇', '🎊']

export default function MiTarjeta() {
  const [negocio, setNegocio] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [paso, setPaso] = useState(1) // 1: diseños, 2: personalizar
  const [disenos, setDisenos] = useState([])
  const [disenoSeleccionado, setDisenoSeleccionado] = useState(null)
  const [color, setColor] = useState('#E8763A')
  const [emojiSello, setEmojiSello] = useState('⭐')
  const [emojiPremio, setEmojiPremio] = useState('🎁')
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

      // Cargar diseños según tipo
      const tipoDisenos = DISENOS_POR_TIPO[data.tipo] || DISENOS_POR_TIPO['Otro']
      setDisenos(tipoDisenos)

      // Cargar configuración existente
      setNumSellos(data.num_sellos || 10)
      setPremio(data.premio || '')
      setCaducidad(data.caducidad_meses || 12)

      // Cargar diseño guardado
      if (data.diseno && Object.keys(data.diseno).length > 0) {
        setColor(data.diseno.color || '#E8763A')
        setEmojiSello(data.diseno.sello || '⭐')
        setEmojiPremio(data.diseno.premio || '🎁')
        setDisenoSeleccionado(data.diseno.id || null)
      }

      setLoading(false)
    }
    init()
  }, [navigate])

  const seleccionarDiseno = (diseno) => {
    setDisenoSeleccionado(diseno.id)
    setColor(diseno.color)
    setEmojiSello(diseno.sello)
    setEmojiPremio(diseno.premio)
  }

  const handleGuardar = async () => {
    setError('')
    if (!premio.trim()) { setError('Define el premio para tu cliente'); return }
    setSaving(true)

    const { error: updateError } = await supabase
      .from('negocios')
      .update({
        num_sellos: numSellos,
        premio,
        caducidad_meses: caducidad,
        diseno: {
          id: disenoSeleccionado,
          color,
          sello: emojiSello,
          premio: emojiPremio,
        },
      })
      .eq('user_id', user.id)

    setSaving(false)
    if (updateError) {
      setError('Error al guardar: ' + updateError.message)
    } else {
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2500)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
    </div>
  )

  // Preview de la tarjeta
  const Preview = () => (
    <div style={{
      background: `linear-gradient(145deg, ${color}dd, ${color})`,
      borderRadius: '16px',
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    }}>
      <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', top: -20, right: -20 }} />
      <h3 style={{ margin: '0 0 0.5rem', color: '#fff', fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '1.1rem', position: 'relative', zIndex: 1 }}>
        {negocio?.nombre}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>
        {Array.from({ length: Math.min(numSellos, 10) }).map((_, i) => (
          <div key={i} style={{
            aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: i < 3 ? '#fff' : 'rgba(255,255,255,0.2)',
            border: i < 3 ? 'none' : '1.5px solid rgba(255,255,255,0.35)',
            fontSize: '0.7rem',
          }}>
            {i < 3 && (i === numSellos - 1 ? emojiPremio : emojiSello)}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 10px', display: 'inline-block' }}>
        <p style={{ margin: 0, fontSize: '11px', color: '#fff' }}>🎁 {premio || 'Tu premio aquí'}</p>
      </div>
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

          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              onClick={() => setPaso(1)}
              style={{ ...styles.tab, borderBottom: paso === 1 ? '2px solid #E8763A' : '2px solid transparent', color: paso === 1 ? '#E8763A' : '#888' }}
            >
              Diseño
            </button>
            <button
              onClick={() => setPaso(2)}
              style={{ ...styles.tab, borderBottom: paso === 2 ? '2px solid #E8763A' : '2px solid transparent', color: paso === 2 ? '#E8763A' : '#888' }}
            >
              Configuración
            </button>
          </div>

          <div style={styles.contenido}>

            {/* TAB 1 — Diseño */}
            {paso === 1 && (
              <div style={styles.columnas}>
                <div style={{ flex: 1 }}>
                  <p style={styles.seccionLabel}>Plantillas para {negocio?.tipo}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                    {disenos.map(d => (
                      <button
                        key={d.id}
                        onClick={() => seleccionarDiseno(d)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '0.85rem 1rem', borderRadius: '12px', cursor: 'pointer',
                          border: disenoSeleccionado === d.id ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                          backgroundColor: disenoSeleccionado === d.id ? '#FFF4EE' : '#fafafa',
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                          {d.sello}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600', color: '#1C1C1E' }}>{d.nombre}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>Sello: {d.sello} · Premio: {d.premio}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <p style={styles.seccionLabel}>Color personalizado</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                    {COLORES_EXTRA.map(c => (
                      <button
                        key={c}
                        onClick={() => { setColor(c); setDisenoSeleccionado(null) }}
                        style={{
                          width: 32, height: 32, borderRadius: '50%', backgroundColor: c,
                          border: color === c ? '3px solid #E8763A' : '2px solid transparent',
                          outline: color === c ? '2px solid #e8e8e8' : 'none',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>

                  <p style={styles.seccionLabel}>Emoji de sello</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                    {SELLOS_OPCIONES.map(e => (
                      <button
                        key={e}
                        onClick={() => setEmojiSello(e)}
                        style={{
                          width: 40, height: 40, borderRadius: '10px', fontSize: '1.2rem',
                          border: emojiSello === e ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                          backgroundColor: emojiSello === e ? '#FFF4EE' : '#fafafa',
                          cursor: 'pointer',
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>

                  <p style={styles.seccionLabel}>Emoji de premio</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {PREMIOS_OPCIONES.map(e => (
                      <button
                        key={e}
                        onClick={() => setEmojiPremio(e)}
                        style={{
                          width: 40, height: 40, borderRadius: '10px', fontSize: '1.2rem',
                          border: emojiPremio === e ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                          backgroundColor: emojiPremio === e ? '#FFF4EE' : '#fafafa',
                          cursor: 'pointer',
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div style={{ width: '100%', maxWidth: 280 }}>
                  <p style={styles.seccionLabel}>Vista previa</p>
                  <Preview />
                </div>
              </div>
            )}

            {/* TAB 2 — Configuración */}
            {paso === 2 && (
              <div style={{ maxWidth: 480 }}>
                <p style={styles.seccionLabel}>Número de sellos para el premio</p>
                <div style={{ marginBottom: '1.25rem' }}>
                  <input
                    type="range" min="5" max="20" value={numSellos}
                    onChange={e => setNumSellos(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#E8763A' }}>{numSellos}</span>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>sellos</span>
                  </div>
                </div>

                <p style={styles.seccionLabel}>¿Qué gana el cliente?</p>
                <input
                  type="text"
                  placeholder="Ej: 1 corte de pelo gratis"
                  value={premio}
                  onChange={e => setPremio(e.target.value)}
                  style={styles.input}
                />

                <p style={styles.seccionLabel}>Caducidad de los sellos</p>
                <div style={{ marginBottom: '1.5rem' }}>
                  <input
                    type="range" min="6" max="24" value={caducidad}
                    onChange={e => setCaducidad(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#E8763A' }}>{caducidad}</span>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>meses</span>
                  </div>
                </div>

                {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
              </div>
            )}

            {/* Botón guardar */}
            <button
              onClick={handleGuardar}
              disabled={saving}
              style={{
                padding: '0.9rem 2rem',
                backgroundColor: guardado ? '#2D6A4F' : '#E8763A',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer',
                marginTop: '1.5rem', transition: 'background-color 0.3s',
              }}
            >
              {saving ? 'Guardando...' : guardado ? '✓ Guardado' : 'Guardar cambios'}
            </button>

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
  tabs: {
    display: 'flex', gap: '0', borderBottom: '1px solid #e8e8e8',
    marginBottom: '1.5rem', marginTop: '1rem',
  },
  tab: {
    padding: '0.65rem 1.25rem', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500',
  },
  contenido: { display: 'flex', flexDirection: 'column' },
  columnas: { display: 'flex', gap: '2rem', flexWrap: 'wrap' },
  seccionLabel: { fontSize: '0.78rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.6rem' },
  input: {
    padding: '0.78rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8',
    fontSize: '0.9rem', outline: 'none', backgroundColor: '#fafafa',
    color: '#1C1C1E', width: '100%', boxSizing: 'border-box', marginBottom: '1.25rem',
  },
}