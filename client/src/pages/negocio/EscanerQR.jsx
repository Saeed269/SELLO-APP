import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'

export default function EscanerQR() {
  const [estado, setEstado] = useState('escaneando') // 'escaneando' | 'cargando' | 'ok' | 'error' | 'premio'
  const [mensaje, setMensaje] = useState('')
  const [tarjeta, setTarjeta] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const scannerRef = useRef(null)
  const procesando = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    const verificarAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/negocio/login')
        return
      }

      const { data: negocioData } = await supabase
        .from('negocios')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!negocioData) {
        navigate('/negocio/onboarding')
        return
      }
      setNegocio(negocioData)
    }
    verificarAuth()
  }, [navigate])

  useEffect(() => {
    if (!negocio) return

    const html5QrCode = new Html5Qrcode('qr-reader')
    scannerRef.current = html5QrCode

    html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        if (procesando.current) return
        procesando.current = true

        await html5QrCode.stop().catch(() => {})
        await procesarQR(decodedText)
      },
      () => {} // error de frame — ignorar
    ).catch((err) => {
      setEstado('error')
      setMensaje('No se pudo acceder a la cámara. ' + err)
    })

    return () => {
      html5QrCode.stop().catch(() => {})
    }
  }, [negocio])

  const procesarQR = async (texto) => {
    setEstado('cargando')

    // Extraer tarjetaId de la URL escaneada
    let tarjetaId = null
    try {
      const url = new URL(texto)
      tarjetaId = url.searchParams.get('tarjeta')
    } catch {
      // Si no es URL válida, intentar como UUID directo
      tarjetaId = texto.trim()
    }

    if (!tarjetaId) {
      setEstado('error')
      setMensaje('QR inválido: no se encontró el ID de la tarjeta.')
      return
    }

    // Buscar la tarjeta
    const { data: tarjetaData, error } = await supabase
      .from('tarjetas')
      .select('*')
      .eq('id', tarjetaId)
      .single()

    if (error || !tarjetaData) {
      setEstado('error')
      setMensaje(`Tarjeta no encontrada. ID: ${tarjetaId}`)
      return
    }

    // Verificar que la tarjeta pertenece a este negocio
    if (tarjetaData.negocio_id !== negocio.id) {
      setEstado('error')
      setMensaje('Esta tarjeta no pertenece a tu negocio.')
      return
    }

    // Comprobar si ya tiene el premio listo
    if (tarjetaData.sellos_actuales >= negocio.num_sellos) {
      setTarjeta(tarjetaData)
      setEstado('premio')
      return
    }

    // Añadir sello
    const nuevosSELLOS = tarjetaData.sellos_actuales + 1
    const esUltimoSello = nuevosSELLOS >= negocio.num_sellos

    const { error: updateError } = await supabase
      .from('tarjetas')
      .update({ sellos_actuales: nuevosSELLOS })
      .eq('id', tarjetaId)

    if (updateError) {
      setEstado('error')
      setMensaje('Error al añadir el sello: ' + updateError.message)
      return
    }

    setTarjeta({ ...tarjetaData, sellos_actuales: nuevosSELLOS })
    setEstado(esUltimoSello ? 'premio' : 'ok')
  }

  const reiniciar = () => {
    procesando.current = false
    setTarjeta(null)
    setMensaje('')
    setEstado('escaneando')

    const html5QrCode = new Html5Qrcode('qr-reader')
    scannerRef.current = html5QrCode

    html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        if (procesando.current) return
        procesando.current = true
        await html5QrCode.stop().catch(() => {})
        await procesarQR(decodedText)
      },
      () => {}
    ).catch((err) => {
      setEstado('error')
      setMensaje('No se pudo acceder a la cámara. ' + err)
    })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/negocio/dashboard')} style={styles.backBtn}>← Volver</button>
        <h1 style={styles.logo}>SELLO</h1>
        <div style={{ width: 80 }} />
      </div>

      <div style={styles.content}>
        <h2 style={styles.titulo}>Escanear QR del cliente</h2>
        <p style={styles.subtitulo}>{negocio?.nombre}</p>

        {(estado === 'escaneando' || estado === 'cargando') && (
          <div style={styles.scannerWrapper}>
            <div id="qr-reader" style={styles.qrReader} />
            {estado === 'cargando' && (
              <div style={styles.overlay}>
                <p style={styles.overlayTexto}>Procesando...</p>
              </div>
            )}
          </div>
        )}

        {estado === 'ok' && tarjeta && (
          <div style={styles.resultCard}>
            <div style={styles.checkIcon}>✓</div>
            <h3 style={styles.resultTitulo}>¡Sello añadido!</h3>
            <p style={styles.resultInfo}>
              {tarjeta.sellos_actuales} / {negocio?.num_sellos} sellos
            </p>
            <div style={styles.sellosBar}>
              {Array.from({ length: negocio?.num_sellos || 10 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.selloPunto,
                    backgroundColor: i < tarjeta.sellos_actuales ? '#E8763A' : '#e0e0e0',
                  }}
                />
              ))}
            </div>
            <button onClick={reiniciar} style={styles.btnPrimario}>
              Escanear otro QR
            </button>
          </div>
        )}

        {estado === 'premio' && tarjeta && (
          <div style={{ ...styles.resultCard, borderColor: '#FFD700' }}>
            <div style={{ ...styles.checkIcon, backgroundColor: '#FFD700', color: '#1C1C1E' }}>★</div>
            <h3 style={styles.resultTitulo}>¡Premio completado!</h3>
            <p style={styles.resultInfo}>
              Este cliente ha completado su tarjeta.<br />
              <strong>{negocio?.premio}</strong>
            </p>
            <p style={styles.resultSub}>
              Entrega el premio y confirma el canje.
            </p>
            <button onClick={canjearPremio} style={{ ...styles.btnPrimario, backgroundColor: '#FFD700', color: '#1C1C1E' }}>
              Confirmar canje
            </button>
            <button onClick={reiniciar} style={styles.btnSecundario}>
              Cancelar
            </button>
          </div>
        )}

        {estado === 'error' && (
          <div style={{ ...styles.resultCard, borderColor: '#ff4444' }}>
            <div style={{ ...styles.checkIcon, backgroundColor: '#ff4444' }}>✕</div>
            <h3 style={styles.resultTitulo}>Error</h3>
            <p style={styles.resultInfo}>{mensaje}</p>
            <button onClick={reiniciar} style={styles.btnPrimario}>
              Intentar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  )

  async function canjearPremio() {
    const { error } = await supabase
      .from('tarjetas')
      .update({
        sellos_actuales: 0,
        total_canjes: (tarjeta.total_canjes || 0) + 1,
      })
      .eq('id', tarjeta.id)

    if (error) {
      setEstado('error')
      setMensaje('Error al registrar el canje: ' + error.message)
    } else {
      setEstado('ok')
      setTarjeta({ ...tarjeta, sellos_actuales: 0 })
    }
  }
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#E8763A', margin: 0 },
  backBtn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: 'transparent',
    border: '1.5px solid #E8763A',
    borderRadius: '8px',
    color: '#E8763A',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  content: {
    maxWidth: '480px',
    margin: '1.5rem auto',
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titulo: { fontSize: '1.3rem', color: '#1C1C1E', margin: '0 0 0.25rem 0', fontWeight: 'bold' },
  subtitulo: { fontSize: '0.9rem', color: '#888', marginBottom: '1.5rem' },
  scannerWrapper: {
    width: '100%',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  },
  qrReader: { width: '100%' },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(28,28,30,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayTexto: { color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' },
  resultCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '2rem 1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid #E8763A',
    boxSizing: 'border-box',
  },
  checkIcon: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: '#E8763A',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  resultTitulo: { fontSize: '1.4rem', color: '#1C1C1E', margin: '0 0 0.5rem 0', fontWeight: 'bold' },
  resultInfo: { color: '#555', fontSize: '1rem', textAlign: 'center', margin: '0 0 1rem 0', lineHeight: 1.5 },
  resultSub: { color: '#888', fontSize: '0.85rem', textAlign: 'center', margin: '0 0 1.5rem 0' },
  sellosBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  selloPunto: {
    width: 20,
    height: 20,
    borderRadius: '50%',
  },
  btnPrimario: {
    width: '100%',
    padding: '0.9rem',
    backgroundColor: '#E8763A',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '0.75rem',
  },
  btnSecundario: {
    width: '100%',
    padding: '0.9rem',
    backgroundColor: 'transparent',
    color: '#888',
    border: '1.5px solid #ddd',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
  },
}
