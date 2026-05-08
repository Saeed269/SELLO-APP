import { useState } from 'react'
import { supabase } from '../../../supabase'
import { useNavigate } from 'react-router-dom'
import LoadingScreen from '../../../components/ui/LoadingScreen'
import { COLORS } from '../../../constants'

// ─── Datos estáticos ──────────────────────────────────────────
const CATEGORIAS = [
  { nombre: 'Hostelería',        tipos: ['Cafetería', 'Restaurante', 'Panadería & Pastelería'] },
  { nombre: 'Belleza & Bienestar', tipos: ['Peluquería & Barbería', 'Manicura & Estética', 'Masajes & Spa'] },
  { nombre: 'Deporte & Salud',   tipos: ['Yoga & Pilates', 'Entrenador Personal'] },
  { nombre: 'Servicios',         tipos: ['Lavandería', 'Lavado de Coches', 'Comercio', 'Otro'] },
]

const TIPOS_CON_BONOS = new Set(['Yoga & Pilates', 'Entrenador Personal', 'Lavandería', 'Lavado de Coches', 'Comercio', 'Otro'])

// ─── Subcomponentes ───────────────────────────────────────────
function ProgressBar({ paso, total }) {
  return (
    <>
      <div style={{ display: 'flex', gap: '6px', margin: '1rem 0 0.3rem' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: paso > i ? COLORS.primary : '#e8e8e8', transition: 'background-color 0.3s' }} />
        ))}
      </div>
      <p style={{ fontSize: '0.78rem', color: '#bbb', margin: '0 0 1rem', textAlign: 'right' }}>
        Paso {paso} de {total}
      </p>
    </>
  )
}

function BotonesNav({ onAtras, onSiguiente, labelSiguiente = 'Siguiente →', disabled = false }) {
  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '0.25rem' }}>
      <button onClick={onAtras} style={s.btnSecundario}>← Atrás</button>
      <button onClick={onSiguiente} disabled={disabled} style={s.btnPrimario}>{labelSiguiente}</button>
    </div>
  )
}

function PasoTipoNegocio({ tipo, onSelect, onSiguiente, error }) {
  return (
    <div style={s.seccion}>
      <h2 style={s.h2}>¿Qué tipo de negocio tienes?</h2>
      <div style={{ overflowY: 'auto', maxHeight: '55vh', paddingRight: '4px' }}>
        {CATEGORIAS.map(cat => (
          <div key={cat.nombre} style={{ marginBottom: '0.75rem' }}>
            <p style={s.catLabel}>{cat.nombre}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {cat.tipos.map(t => (
                <button key={t} onClick={() => onSelect(t)} style={{
                  padding: '0.55rem 0.4rem', borderRadius: '10px',
                  fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center', lineHeight: 1.3,
                  backgroundColor: tipo === t ? COLORS.primary : '#fafafa',
                  color: tipo === t ? '#fff' : '#1C1C1E',
                  border: tipo === t ? `2px solid ${COLORS.primary}` : '1.5px solid #e8e8e8',
                  fontWeight: tipo === t ? '600' : '400',
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {error && <p style={s.error}>{error}</p>}
      <button style={{ ...s.btnPrimario, marginTop: '0.75rem' }} onClick={onSiguiente}>
        Siguiente →
      </button>
    </div>
  )
}

function PasoTipoTarjeta({ tipoTarjeta, onSelect, onAtras, onSiguiente, error }) {
  const opciones = [
    { id: 'sellos', emoji: '⭐', titulo: 'Tarjeta de Sellos',         desc: 'El cliente acumula sellos hasta conseguir un premio' },
    { id: 'bonos',  emoji: '🎫', titulo: 'Tarjeta de Bonos/Sesiones', desc: 'El cliente compra un bono de X sesiones que se van descontando' },
  ]

  return (
    <div style={s.seccion}>
      <h2 style={s.h2}>¿Qué tipo de tarjeta quieres?</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
        {opciones.map(op => (
          <button key={op.id} onClick={() => onSelect(op.id)} style={{
            padding: '0.85rem', borderRadius: '12px', cursor: 'pointer',
            textAlign: 'left', width: '100%', boxSizing: 'border-box',
            border: tipoTarjeta === op.id ? `2px solid ${COLORS.primary}` : '1.5px solid #e8e8e8',
            backgroundColor: tipoTarjeta === op.id ? '#FFF4EE' : '#fafafa',
          }}>
            <p style={{ margin: '0 0 3px', fontWeight: '600', color: '#1C1C1E', fontSize: '0.9rem' }}>{op.emoji} {op.titulo}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{op.desc}</p>
          </button>
        ))}
      </div>
      {error && <p style={s.error}>{error}</p>}
      <BotonesNav onAtras={onAtras} onSiguiente={onSiguiente} />
    </div>
  )
}

function PasoConfigurar({ tipoTarjeta, numSellos, premio, caducidad, onNumSellos, onPremio, onCaducidad, onAtras, onGuardar, loading, error }) {
  const esBono = tipoTarjeta === 'bonos'

  return (
    <div style={s.seccion}>
      <h2 style={s.h2}>{esBono ? 'Configura tu bono' : 'Configura tu tarjeta'}</h2>

      <p style={s.fieldLabel}>{esBono ? 'Número de sesiones del bono' : 'Sellos para conseguir el premio'}</p>
      <div style={{ marginBottom: '1rem' }}>
        <input type="range" min="5" max="20" value={numSellos} onChange={e => onNumSellos(Number(e.target.value))} style={{ width: '100%' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: '700', color: COLORS.primary }}>{numSellos}</span>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>{esBono ? 'sesiones' : 'sellos'}</span>
        </div>
      </div>

      <p style={s.fieldLabel}>{esBono ? '¿Qué incluye el bono?' : '¿Qué gana el cliente?'}</p>
      <input
        type="text"
        placeholder={esBono ? 'Ej: 10 clases de yoga' : 'Ej: 1 corte de pelo gratis'}
        value={premio}
        onChange={e => onPremio(e.target.value)}
        style={s.input}
      />

      <p style={s.fieldLabel}>Caducidad</p>
      <div style={{ marginBottom: '1rem' }}>
        <input type="range" min="6" max="24" value={caducidad} onChange={e => onCaducidad(Number(e.target.value))} style={{ width: '100%' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: '700', color: COLORS.primary }}>{caducidad}</span>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>meses</span>
        </div>
      </div>

      {error && <p style={s.error}>{error}</p>}
      <BotonesNav onAtras={onAtras} onSiguiente={onGuardar} labelSiguiente="Crear mi tarjeta ✓" disabled={loading} />
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────
export default function Onboarding() {
  const [paso,        setPaso]        = useState(1)
  const [tipo,        setTipo]        = useState('')
  const [tipoTarjeta, setTipoTarjeta] = useState('sellos')
  const [numSellos,   setNumSellos]   = useState(10)
  const [premio,      setPremio]      = useState('')
  const [caducidad,   setCaducidad]   = useState(12)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const navigate = useNavigate()

  const conBonos   = TIPOS_CON_BONOS.has(tipo)
  const totalPasos = conBonos ? 3 : 2

  const handleGuardar = async () => {
    setError('')
    if (!premio.trim()) { setError('Define el premio para tu cliente'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error: updateError } = await supabase.from('negocios').update({
      tipo, tipo_tarjeta: tipoTarjeta, num_sellos: numSellos, premio, caducidad_meses: caducidad,
    }).eq('user_id', user.id)
    setLoading(false)
    if (updateError) { setError('Error al guardar: ' + updateError.message); return }
    navigate('/negocio/dashboard')
  }

  const siguiente = () => {
    setError('')
    if (paso === 1) {
      if (!tipo) { setError('Selecciona el tipo de negocio'); return }
      setPaso(2)
    } else if (paso === 2) {
      conBonos ? setPaso(3) : handleGuardar()
    } else if (paso === 3) {
      handleGuardar()
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div style={s.root}>
      <div style={s.card}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={s.logo}>SELLO</h1>
          <p style={s.subtitulo}>Configura tu tarjeta de fidelización</p>
        </div>

        <ProgressBar paso={paso} total={totalPasos} />

        {paso === 1 && (
          <PasoTipoNegocio tipo={tipo} onSelect={setTipo} onSiguiente={siguiente} error={error} />
        )}
        {paso === 2 && conBonos && (
          <PasoTipoTarjeta tipoTarjeta={tipoTarjeta} onSelect={setTipoTarjeta} onAtras={() => { setError(''); setPaso(1) }} onSiguiente={siguiente} error={error} />
        )}
        {((paso === 2 && !conBonos) || (paso === 3 && conBonos)) && (
          <PasoConfigurar
            tipoTarjeta={tipoTarjeta} numSellos={numSellos} premio={premio} caducidad={caducidad}
            onNumSellos={setNumSellos} onPremio={setPremio} onCaducidad={setCaducidad}
            onAtras={() => { setError(''); setPaso(paso - 1) }}
            onGuardar={siguiente} loading={loading} error={error}
          />
        )}
      </div>
    </div>
  )
}

const s = {
  root:       { minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#f9fafb', boxSizing: 'border-box' },
  card:       { width: '100%', maxWidth: '480px', backgroundColor: '#fff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', boxSizing: 'border-box' },
  logo:       { fontSize: '1.8rem', fontWeight: 'bold', color: COLORS.primary, margin: 0, letterSpacing: '0.1em' },
  subtitulo:  { margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#888' },
  seccion:    { display: 'flex', flexDirection: 'column' },
  h2:         { fontSize: '1.1rem', fontWeight: '700', color: '#1C1C1E', margin: '0 0 0.75rem' },
  catLabel:   { fontSize: '0.72rem', fontWeight: '600', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 5px' },
  fieldLabel: { fontSize: '0.85rem', color: '#555', fontWeight: '500', margin: '0 0 0.4rem' },
  input:      { padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8', fontSize: '0.9rem', outline: 'none', backgroundColor: '#fafafa', color: '#1C1C1E', width: '100%', boxSizing: 'border-box', marginBottom: '1rem' },
  btnPrimario:  { flex: 1, padding: '0.85rem', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
  btnSecundario:{ flex: 1, padding: '0.85rem', backgroundColor: 'transparent', color: COLORS.primary, border: `1.5px solid ${COLORS.primary}`, borderRadius: '10px', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer' },
  error:      { color: COLORS.danger, fontSize: '0.82rem', margin: '0 0 0.5rem' },
}