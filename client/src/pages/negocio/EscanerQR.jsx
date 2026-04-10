import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'

export default function EscanerQR() {
  const [escaneando, setEscaneando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [negocio, setNegocio] = useState(null)
  const scannerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/negocio/login')
        return
      }
      const { data } = await supabase
        .from('negocios')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setNegocio(data)
    }
    init()
  }, [navigate])

  const procesarQR = useCallback(async (url) => {
    console.log('URL escaneada:', url)
    setLoading(true)
    setError('')

    try {
      const urlObj = new URL(url)
      const tarjetaId = urlObj.searchParams.get('tarjeta')

      if (!tarjetaId) {
        setError('QR no válido')
        setLoading(false)
        return
      }

      const { data: tarjeta, error: tarjetaError } = await supabase
        .from('tarjetas')
        .select('*, clientes(nombre)')
        .eq('id', tarjetaId)
        .single()

      if (tarjetaError || !tarjeta) {
        setError('Tarjeta no encontrada')
        setLoading(false)
        return
      }

      if (tarjeta.negocio_id !== negocio?.id) {
        setError('Esta tarjeta no pertenece a tu negocio')
        setLoading(false)
        return
      }

      setResultado(tarjeta)
      setLoading(false)
    } catch (_e) {
      setError('QR no válido')
      setLoading(false)
    }
  }, [negocio])

  const iniciarEscaner = () => {
    setError('')
    setResultado(null)
    setEscaneando(true)

    setTimeout(() => {
      const html5Qrcode = new Html5Qrcode('reader')
      scannerRef.current = html5Qrcode

      html5Qrcode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await html5Qrcode.stop()
          setEscaneando(false)
          await procesarQR(decodedText)
        },
        () => { /* QR no reconocido aún */ }
      ).catch(() => {
        setError('No se puede acceder a la cámara')
        setEscaneando(false)
      })
    }, 100)
  }

  const detenerEscaner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
      } catch (_e) { /* error controlado */ }
    }
    setEscaneando(false)
  }

  const añadirSello = async () => {
    if (!resultado) return
    setLoading(true)

    const nuevosSellos = (resultado.sellos_actuales || 0) + 1

    const { error } = await supabase
      .from('tarjetas')
      .update({ sellos_actuales: nuevosSellos })
      .eq('id', resultado.id)

    if (error) {
      setError('Error al añadir sello: ' + error.message)
    } else {
      setResultado({ ...resultado, sellos_actuales: nuevosSellos })
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>SELLO</h1>
        <button onClick={() => navigate('/negocio/dashboard')} style={styles.backBtn}>
          ← Dashboard
        </button>
      </div>

      <div style={styles.content}>
        <h2 style={styles.titulo}>Añadir sello</h2>
        <p style={styles.subtitulo}>Escanea el QR personal del cliente</p>

        {!escaneando && !resultado && (
          <button onClick={iniciarEscaner} style={styles.scanBtn}>
            📷 Escanear QR del cliente
          </button>
        )}

        {escaneando && (
          <div style={styles.scannerContainer}>
            <div id="reader" style={{ width: '100%' }} />
            <button onClick={detenerEscaner} style={styles.stopBtn}>
              Cancelar
            </button>
          </div>
        )}

        {loading && <p style={styles.loading}>Procesando...</p>}

        {error && (
          <div style={styles.errorCard}>
            <p style={styles.errorText}>{error}</p>
            <button onClick={() => { setError(''); setResultado(null) }} style={styles.retryBtn}>
              Intentar de nuevo
            </button>
          </div>
        )}

        {resultado && (
          <div style={styles.resultCard}>
            <h3 style={styles.clienteNombre}>
              {resultado.clientes?.nombre || 'Cliente'}
            </h3>
            <p style={styles.sellosTexto}>
              Sellos actuales:{' '}
              <strong style={{ color: '#E8763A' }}>
                {resultado.sellos_actuales} / {negocio?.num_sellos}
              </strong>
            </p>

            <div style={styles.sellosGrid}>
              {Array.from({ length: negocio?.num_sellos || 10 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.sello,
                    backgroundColor: i < resultado.sellos_actuales ? '#E8763A' : '#f0f0f0',
                  }}
                >
                  {i < resultado.sellos_actuales && (
                    <span style={{ color: '#fff', fontSize: '0.8rem' }}>✓</span>
                  )}
                </div>
              ))}
            </div>

            {resultado.sellos_actuales >= negocio?.num_sellos ? (
              <div style={styles.premioAlert}>
                <p style={styles.premioTexto}>
                  🏆 ¡Este cliente ha ganado el premio!
                </p>
                <p style={styles.premioSubtexto}>{negocio?.premio}</p>
              </div>
            ) : (
              <button
                onClick={añadirSello}
                style={styles.addBtn}
                disabled={loading}
              >
                {loading ? 'Añadiendo...' : '+ Añadir sello'}
              </button>
            )}

            <button
              onClick={() => { setResultado(null); setError('') }}
              style={styles.nuevoBtn}
            >
              Escanear otro cliente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: '1.8rem', fontWeight: 'bold', color: '#E8763A', margin: 0 },
  backBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1.5px solid #E8763A',
    borderRadius: '8px',
    color: '#E8763A',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  content: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titulo: { fontSize: '1.5rem', color: '#1C1C1E', margin: '0 0 0.5rem 0' },
  subtitulo: { color: '#888', marginBottom: '2rem', fontSize: '0.95rem' },
  scanBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#E8763A',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  scannerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  stopBtn: {
    padding: '0.7rem 1.5rem',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  loading: { color: '#888', fontSize: '1rem' },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '2px solid #dc2626',
    width: '100%',
    boxSizing: 'border-box',
  },
  errorText: { color: '#dc2626', marginBottom: '1rem' },
  retryBtn: {
    padding: '0.7rem 1.5rem',
    backgroundColor: '#E8763A',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  clienteNombre: { fontSize: '1.3rem', color: '#1C1C1E', margin: '0 0 0.5rem 0' },
  sellosTexto: { color: '#555', marginBottom: '1rem', fontSize: '0.95rem' },
  sellosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    width: '100%',
  },
  sello: {
    aspectRatio: '1',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premioAlert: {
    backgroundColor: '#FFF0E6',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
    border: '2px solid #E8763A',
    marginBottom: '1rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  premioTexto: { color: '#E8763A', fontWeight: 'bold', margin: '0 0 0.25rem 0' },
  premioSubtexto: { color: '#888', fontSize: '0.9rem', margin: 0 },
  addBtn: {
    padding: '0.85rem',
    backgroundColor: '#E8763A',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '0.75rem',
  },
  nuevoBtn: {
    padding: '0.7rem',
    backgroundColor: 'transparent',
    color: '#E8763A',
    border: '1.5px solid #E8763A',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
}