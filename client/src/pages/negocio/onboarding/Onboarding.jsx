import { useState } from 'react'
import { supabase } from '../../../supabase'
import { useNavigate } from 'react-router-dom'

const CATEGORIAS = [
  {
    nombre: 'Hostelería',
    tipos: ['Cafetería', 'Restaurante', 'Panadería & Pastelería'],
    bonos: false,
  },
  {
    nombre: 'Belleza & Bienestar',
    tipos: ['Peluquería & Barbería', 'Manicura & Estética', 'Masajes & Spa'],
    bonos: false,
  },
  {
    nombre: 'Deporte & Salud',
    tipos: ['Yoga & Pilates', 'Entrenador Personal'],
    bonos: true,
  },
  {
    nombre: 'Servicios',
    tipos: ['Lavandería', 'Lavado de Coches', 'Comercio', 'Otro'],
    bonos: true,
  },
]

const TIPOS_CON_BONOS = ['Yoga & Pilates', 'Entrenador Personal', 'Lavandería', 'Lavado de Coches', 'Comercio', 'Otro']

export default function Onboarding() {
  const [paso, setPaso] = useState(1)
  const [tipo, setTipo] = useState('')
  const [tipoTarjeta, setTipoTarjeta] = useState('sellos')
  const [numSellos, setNumSellos] = useState(10)
  const [premio, setPremio] = useState('')
  const [caducidad, setCaducidad] = useState(12)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const permitesBonos = TIPOS_CON_BONOS.includes(tipo)
  const totalPasos = permitesBonos ? 3 : 2

  const handleGuardar = async () => {
    setError('')
    if (!premio.trim()) { setError('Define el premio para tu cliente'); return }
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { error: updateError } = await supabase
      .from('negocios')
      .update({
        tipo,
        tipo_tarjeta: tipoTarjeta,
        num_sellos: numSellos,
        premio,
        caducidad_meses: caducidad,
      })
      .eq('user_id', user.id)

    if (updateError) {
      setError('Error al guardar: ' + updateError.message)
      setLoading(false)
    } else {
      setLoading(false)
      navigate('/negocio/dashboard')
    }
  }

  const siguiente = () => {
    setError('')
    if (paso === 1) {
      if (!tipo) { setError('Selecciona el tipo de negocio'); return }
      setPaso(2)
    } else if (paso === 2) {
      if (permitesBonos) {
        // paso 2 = elegir tipo tarjeta → ir a paso 3 (configurar)
        setPaso(3)
      } else {
        // paso 2 = configurar → guardar
        handleGuardar()
      }
    } else if (paso === 3) {
      // paso 3 = configurar (cuando hay bonos) → guardar
      handleGuardar()
    }
  }

  const atras = () => {
    setError('')
    setPaso(paso - 1)
  }

  // Determinar qué muestra cada paso
  const mostrarTipoTarjeta = paso === 2 && permitesBonos
  const mostrarConfigurar = (paso === 2 && !permitesBonos) || (paso === 3 && permitesBonos)

  return (
    <div style={styles.root}>

      {loading && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)', zIndex: 999 }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>Creando tu tarjeta...</p>
        </div>
      )}

      <div style={styles.formWrap}>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={styles.logo}>SELLO</h1>
          <p style={styles.subtitulo}>Configura tu tarjeta de fidelización</p>
        </div>

        {/* Barra de progreso */}
        <div style={styles.progreso}>
          {Array.from({ length: totalPasos }).map((_, i) => (
            <div key={i} style={{
              ...styles.barraSegmento,
              backgroundColor: paso > i ? '#E8763A' : '#e8e8e8',
            }} />
          ))}
        </div>
        <p style={styles.pasoTexto}>Paso {paso} de {totalPasos}</p>

        {/* PASO 1 — Tipo de negocio */}
        {paso === 1 && (
          <div style={styles.seccion}>
            <h2 style={styles.h2}>¿Qué tipo de negocio tienes?</h2>
            <div style={{ overflowY: 'auto', maxHeight: '55vh', paddingRight: '4px' }}>
              {CATEGORIAS.map(cat => (
                <div key={cat.nombre} style={{ marginBottom: '0.75rem' }}>
                  <p style={styles.catLabel}>{cat.nombre}</p>
                  <div style={styles.tiposGrid}>
                    {cat.tipos.map(t => (
                      <button
                        key={t}
                        onClick={() => setTipo(t)}
                        style={{
                          ...styles.tipoBtn,
                          backgroundColor: tipo === t ? '#E8763A' : '#fafafa',
                          color: tipo === t ? '#fff' : '#1C1C1E',
                          border: tipo === t ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                          fontWeight: tipo === t ? '600' : '400',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button style={{ ...styles.btnPrimario, marginTop: '0.75rem' }} onClick={siguiente}>
              Siguiente →
            </button>
          </div>
        )}

        {/* PASO 2 (con bonos) — Tipo de tarjeta */}
        {mostrarTipoTarjeta && (
          <div style={styles.seccion}>
            <h2 style={styles.h2}>¿Qué tipo de tarjeta quieres?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
              <button
                onClick={() => setTipoTarjeta('sellos')}
                style={{
                  ...styles.tarjetaOpcion,
                  border: tipoTarjeta === 'sellos' ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                  backgroundColor: tipoTarjeta === 'sellos' ? '#FFF4EE' : '#fafafa',
                }}
              >
                <p style={{ margin: '0 0 3px', fontWeight: '600', color: '#1C1C1E', fontSize: '0.9rem' }}>⭐ Tarjeta de Sellos</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>El cliente acumula sellos hasta conseguir un premio</p>
              </button>
              <button
                onClick={() => setTipoTarjeta('bonos')}
                style={{
                  ...styles.tarjetaOpcion,
                  border: tipoTarjeta === 'bonos' ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                  backgroundColor: tipoTarjeta === 'bonos' ? '#FFF4EE' : '#fafafa',
                }}
              >
                <p style={{ margin: '0 0 3px', fontWeight: '600', color: '#1C1C1E', fontSize: '0.9rem' }}>🎫 Tarjeta de Bonos/Sesiones</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>El cliente compra un bono de X sesiones que se van descontando</p>
              </button>
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.botones}>
              <button style={styles.btnSecundario} onClick={atras}>← Atrás</button>
              <button style={styles.btnPrimario} onClick={siguiente}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* PASO 2 (sin bonos) o PASO 3 (con bonos) — Configurar tarjeta */}
        {mostrarConfigurar && (
          <div style={styles.seccion}>
            <h2 style={styles.h2}>
              {tipoTarjeta === 'bonos' ? 'Configura tu bono' : 'Configura tu tarjeta'}
            </h2>

            <p style={styles.fieldLabel}>
              {tipoTarjeta === 'bonos' ? 'Número de sesiones del bono' : 'Sellos para conseguir el premio'}
            </p>
            <div style={styles.rangeWrap}>
              <input
                type="range" min="5" max="20" value={numSellos}
                onChange={e => setNumSellos(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={styles.rangeValor}>
                <span style={styles.rangeNum}>{numSellos}</span>
                <span style={styles.rangeSub}>{tipoTarjeta === 'bonos' ? 'sesiones' : 'sellos'}</span>
              </div>
            </div>

            <p style={styles.fieldLabel}>
              {tipoTarjeta === 'bonos' ? '¿Qué incluye el bono?' : '¿Qué gana el cliente?'}
            </p>
            <input
              type="text"
              placeholder={tipoTarjeta === 'bonos' ? 'Ej: 10 clases de yoga' : 'Ej: 1 corte de pelo gratis'}
              value={premio}
              onChange={e => setPremio(e.target.value)}
              style={styles.input}
            />

            <p style={styles.fieldLabel}>Caducidad</p>
            <div style={styles.rangeWrap}>
              <input
                type="range" min="6" max="24" value={caducidad}
                onChange={e => setCaducidad(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={styles.rangeValor}>
                <span style={styles.rangeNum}>{caducidad}</span>
                <span style={styles.rangeSub}>meses</span>
              </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.botones}>
              <button style={styles.btnSecundario} onClick={atras}>← Atrás</button>
              <button style={styles.btnPrimario} onClick={siguiente} disabled={loading}>
                Crear mi tarjeta ✓
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100dvh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '1rem', backgroundColor: '#f9f9f9',
    boxSizing: 'border-box',
  },
  formWrap: {
    width: '100%', maxWidth: '480px', backgroundColor: '#fff',
    borderRadius: '20px', padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    boxSizing: 'border-box',
  },
  logo: { fontSize: '1.8rem', fontWeight: 'bold', color: '#E8763A', margin: 0, letterSpacing: '0.1em' },
  subtitulo: { margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#888' },
  progreso: { display: 'flex', gap: '6px', margin: '1rem 0 0.3rem' },
  barraSegmento: { flex: 1, height: '4px', borderRadius: '2px', transition: 'background-color 0.3s' },
  pasoTexto: { fontSize: '0.78rem', color: '#bbb', margin: '0 0 1rem', textAlign: 'right' },
  seccion: { display: 'flex', flexDirection: 'column' },
  h2: { fontSize: '1.1rem', fontWeight: '700', color: '#1C1C1E', margin: '0 0 0.75rem' },
  catLabel: { fontSize: '0.72rem', fontWeight: '600', color: '#E8763A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 5px' },
  tiposGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' },
  tipoBtn: {
    padding: '0.55rem 0.4rem', borderRadius: '10px',
    fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center', lineHeight: 1.3,
  },
  tarjetaOpcion: {
    padding: '0.85rem', borderRadius: '12px', cursor: 'pointer',
    textAlign: 'left', width: '100%', boxSizing: 'border-box',
  },
  fieldLabel: { fontSize: '0.85rem', color: '#555', fontWeight: '500', margin: '0 0 0.4rem' },
  rangeWrap: { marginBottom: '1rem' },
  rangeValor: { display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' },
  rangeNum: { fontSize: '1.4rem', fontWeight: '700', color: '#E8763A' },
  rangeSub: { fontSize: '0.8rem', color: '#888' },
  input: {
    padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8',
    fontSize: '0.9rem', outline: 'none', backgroundColor: '#fafafa',
    color: '#1C1C1E', width: '100%', boxSizing: 'border-box', marginBottom: '1rem',
  },
  botones: { display: 'flex', gap: '10px', marginTop: '0.25rem' },
  btnPrimario: {
    flex: 1, padding: '0.85rem', backgroundColor: '#E8763A', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer',
  },
  btnSecundario: {
    flex: 1, padding: '0.85rem', backgroundColor: 'transparent', color: '#E8763A',
    border: '1.5px solid #E8763A', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer',
  },
  error: { color: '#dc2626', fontSize: '0.82rem', margin: '0 0 0.5rem' },
}