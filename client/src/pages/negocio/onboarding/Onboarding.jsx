import { useState } from 'react'
import { supabase } from '../../../supabase'
import { useNavigate } from 'react-router-dom'

const TIPOS_NEGOCIO = [
  'Peluquería / Barbería',
  'Salón de belleza',
  'Cafetería / Restaurante',
  'Gimnasio / Entrenador personal',
  'Centro de yoga / Pilates',
  'Farmacia',
  'Lavandería',
  'Otro',
]

export default function Onboarding() {
  const [paso, setPaso] = useState(1)
  const [tipo, setTipo] = useState('')
  const [numSellos, setNumSellos] = useState(10)
  const [premio, setPremio] = useState('')
  const [caducidad, setCaducidad] = useState(12)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGuardar = async () => {
    setError('')
    if (!tipo || !premio) {
      setError('Por favor rellena todos los campos')
      return
    }
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('negocios')
      .update({
        tipo,
        num_sellos: numSellos,
        premio,
        caducidad_meses: caducidad,
      })
      .eq('user_id', user.id)

    if (error) {
      setError('Error al guardar: ' + error.message)
      setLoading(false)
    } else {
      navigate('/negocio/dashboard')
    }
  }

  const totalPasos = 3

  return (
    <div style={styles.root}>

      {/* Splash loading */}
      {loading && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)', zIndex: 999 }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>Creando tu tarjeta...</p>
        </div>
      )}

      <div style={styles.formWrap}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={styles.logo}>SELLO</h1>
          <p style={styles.subtitulo}>Configura tu tarjeta de fidelización</p>
        </div>

        {/* Barra de progreso */}
        <div style={styles.progreso}>
          {[1, 2, 3].map(p => (
            <div key={p} style={{
              ...styles.barraSegmento,
              backgroundColor: paso >= p ? '#E8763A' : '#e8e8e8',
            }} />
          ))}
        </div>
        <p style={styles.pasoTexto}>Paso {paso} de {totalPasos}</p>

        {/* Paso 1 — Tipo de negocio */}
        {paso === 1 && (
          <div style={styles.seccion}>
            <h2 style={styles.h2}>¿Qué tipo de negocio tienes?</h2>
            <div style={styles.tiposGrid}>
              {TIPOS_NEGOCIO.map(t => (
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
            {error && <p style={styles.error}>{error}</p>}
            <button
              style={styles.btnPrimario}
              onClick={() => {
                if (!tipo) { setError('Selecciona el tipo de negocio'); return }
                setError('')
                setPaso(2)
              }}
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Paso 2 — Sellos y premio */}
        {paso === 2 && (
          <div style={styles.seccion}>
            <h2 style={styles.h2}>Configura tu tarjeta</h2>

            <p style={styles.fieldLabel}>Sellos para conseguir el premio</p>
            <div style={styles.rangeWrap}>
              <input
                type="range" min="5" max="20" value={numSellos}
                onChange={e => setNumSellos(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={styles.rangeValor}>
                <span style={styles.rangeNum}>{numSellos}</span>
                <span style={styles.rangeSub}>sellos</span>
              </div>
            </div>

            <p style={styles.fieldLabel}>¿Qué premio recibirá el cliente?</p>
            <input
              type="text"
              placeholder="Ej: 1 corte de pelo gratis"
              value={premio}
              onChange={e => setPremio(e.target.value)}
              style={styles.input}
            />

            <p style={styles.fieldLabel}>Caducidad de los sellos</p>
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
              <button style={styles.btnSecundario} onClick={() => setPaso(1)}>← Atrás</button>
              <button style={styles.btnPrimario} onClick={() => {
                if (!premio) { setError('Define el premio para tu cliente'); return }
                setError('')
                setPaso(3)
              }}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* Paso 3 — Resumen */}
        {paso === 3 && (
          <div style={styles.seccion}>
            <h2 style={styles.h2}>Todo listo 🎉</h2>
            <p style={{ fontSize: '0.88rem', color: '#888', margin: '0 0 1.25rem' }}>Revisa los datos antes de crear tu tarjeta</p>

            <div style={styles.resumen}>
              {[
                { label: 'Tipo de negocio', valor: tipo },
                { label: 'Sellos para premio', valor: `${numSellos} sellos` },
                { label: 'Premio', valor: premio },
                { label: 'Caducidad', valor: `${caducidad} meses` },
              ].map(({ label, valor }) => (
                <div key={label} style={styles.resumenFila}>
                  <span style={styles.resumenLabel}>{label}</span>
                  <span style={styles.resumenValor}>{valor}</span>
                </div>
              ))}
            </div>

            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.botones}>
              <button style={styles.btnSecundario} onClick={() => setPaso(2)}>← Atrás</button>
              <button style={styles.btnPrimario} onClick={handleGuardar} disabled={loading}>
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
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
  },
  formWrap: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '2rem 1.75rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  },
  logo: {
    fontSize: '1.8rem', fontWeight: 'bold', color: '#E8763A',
    margin: 0, letterSpacing: '0.1em',
  },
  subtitulo: { margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#888' },
  progreso: { display: 'flex', gap: '6px', margin: '1.25rem 0 0.4rem' },
  barraSegmento: {
    flex: 1, height: '4px', borderRadius: '2px',
    transition: 'background-color 0.3s',
  },
  pasoTexto: { fontSize: '0.78rem', color: '#bbb', margin: '0 0 1.25rem', textAlign: 'right' },
  seccion: { display: 'flex', flexDirection: 'column' },
  h2: { fontSize: '1.1rem', fontWeight: '700', color: '#1C1C1E', margin: '0 0 1rem' },
  tiposGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '8px', marginBottom: '1.25rem',
  },
  tipoBtn: {
    padding: '0.7rem 0.5rem', borderRadius: '10px',
    fontSize: '0.82rem', cursor: 'pointer', textAlign: 'center',
    transition: 'all 0.15s', lineHeight: 1.3,
  },
  fieldLabel: { fontSize: '0.85rem', color: '#555', fontWeight: '500', margin: '0 0 0.5rem' },
  rangeWrap: { marginBottom: '1.25rem' },
  rangeValor: { display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' },
  rangeNum: { fontSize: '1.4rem', fontWeight: '700', color: '#E8763A' },
  rangeSub: { fontSize: '0.8rem', color: '#888' },
  input: {
    padding: '0.78rem 1rem', borderRadius: '10px', border: '1.5px solid #e8e8e8',
    fontSize: '0.9rem', outline: 'none', backgroundColor: '#fafafa',
    color: '#1C1C1E', width: '100%', boxSizing: 'border-box', marginBottom: '1.25rem',
  },
  botones: { display: 'flex', gap: '10px', marginTop: '0.5rem' },
  btnPrimario: {
    flex: 1, padding: '0.85rem', backgroundColor: '#E8763A', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '0.92rem',
    fontWeight: '700', cursor: 'pointer',
  },
  btnSecundario: {
    flex: 1, padding: '0.85rem', backgroundColor: 'transparent', color: '#E8763A',
    border: '1.5px solid #E8763A', borderRadius: '10px', fontSize: '0.92rem',
    fontWeight: '600', cursor: 'pointer',
  },
  resumen: {
    backgroundColor: '#fafafa', borderRadius: '12px',
    padding: '1rem', marginBottom: '1.25rem',
    border: '0.5px solid #e8e8e8',
  },
  resumenFila: {
    display: 'flex', justifyContent: 'space-between',
    padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0',
  },
  resumenLabel: { color: '#888', fontSize: '0.85rem' },
  resumenValor: { color: '#1C1C1E', fontWeight: '600', fontSize: '0.85rem', textAlign: 'right', maxWidth: '55%' },
  error: { color: '#dc2626', fontSize: '0.82rem', margin: '0 0 0.75rem' },
}