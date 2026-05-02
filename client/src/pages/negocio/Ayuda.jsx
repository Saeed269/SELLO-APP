import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import NavNegocio from '../../components/NavNegocio'

const NARANJA = '#E65100'

const FAQS = [
  // 1. Primeras dudas
  {
    pregunta: '¿Cómo se registra un nuevo cliente?',
    respuesta: 'El cliente escanea el QR de tu negocio (visible en el Dashboard), crea una cuenta y su tarjeta se genera automáticamente.',
  },
  {
    pregunta: '¿Los clientes necesitan descargar una app?',
    respuesta: 'No. SELLO es una PWA — los clientes acceden desde el navegador escaneando tu QR. Pueden guardarla en su pantalla de inicio como si fuera una app.',
  },
  // 2. Uso diario
  {
    pregunta: '¿Cómo añado un sello a un cliente?',
    respuesta: 'Hay dos formas: escanea el QR del cliente desde el Dashboard pulsando "Escanear QR del Cliente", o ve a la sección Clientes, busca al cliente y pulsa "+ Añadir Sello".',
  },
  {
    pregunta: '¿Cómo canjeo el premio de un cliente?',
    respuesta: 'Cuando un cliente completa su tarjeta, escanea su QR desde el escáner y serás redirigido automáticamente a la pantalla de canje. Confirma el canje y la tarjeta vuelve a 0.',
  },
  // 3. Personalización
  {
    pregunta: '¿Puedo cambiar el número de sellos o el premio?',
    respuesta: 'Sí, ve a Mi Tarjeta → Configuración y modifica los sellos, el premio o la caducidad. Los cambios se aplican inmediatamente.',
  },
  {
    pregunta: '¿Puedo personalizar el diseño de la tarjeta?',
    respuesta: 'Sí, en Mi Tarjeta → Diseño puedes cambiar el estilo, el color, el efecto decorativo y los iconos de sello y premio.',
  },
  // 4. Técnico
  {
    pregunta: '¿Qué pasa cuando caduca una tarjeta?',
    respuesta: 'Cuando los sellos de un cliente caducan, su contador vuelve a 0 automáticamente según el período de caducidad que hayas configurado.',
  },
]

function FaqItem({ pregunta, respuesta }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
      <button
        onClick={() => setAbierto(!abierto)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}
      >
        <span style={{ fontSize: '0.92rem', fontWeight: '600', color: '#1C1C1E' }}>{pregunta}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: abierto ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {abierto && (
        <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#555', lineHeight: 1.6, textAlign: 'left' }}>{respuesta}</p>
      )}
    </div>
  )
}

export default function Ayuda() {
  const [user, setUser] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const navigate = useNavigate()
  const [modalAbierto, setModalAbierto] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/negocio/login'); return }
      setUser(user)
      const { data: negocioData } = await supabase
        .from('negocios').select('*').eq('user_id', user.id).single()
      if (negocioData) setNegocio(negocioData)
    }
    init()
  }, [navigate])
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const handleEnviar = async () => {
    if (!mensaje.trim()) return
    setEnviando(true)
    // Simular envío — aquí se puede conectar a un servicio de email
    await new Promise(r => setTimeout(r, 1000))
    setEnviando(false)
    setEnviado(true)
    setMensaje('')
    setTimeout(() => {
      setEnviado(false)
      setModalAbierto(false)
    }, 2000)
  }

  return (
    <div style={s.root}>
      <NavNegocio negocio={negocio} user={user} />

      <main style={s.main}>
        <div style={s.inner}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={s.titulo}>Ayuda</h1>
            <p style={s.subtitulo}>Encuentra respuestas rápidas o contacta con nosotros</p>
          </div>

          {/* FAQ */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Preguntas frecuentes</h2>
            {FAQS.map((faq, i) => (
              <FaqItem key={i} pregunta={faq.pregunta} respuesta={faq.respuesta} />
            ))}
          </div>

          {/* Contacto */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>¿Necesitas más ayuda?</h2>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.88rem', color: '#888', lineHeight: 1.6 }}>
              Si no encuentras la respuesta que buscas, contacta con nuestro equipo. Respondemos en menos de 24 horas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => setModalAbierto(true)} style={s.btnContacto}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Enviar mensaje
            </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal mensaje */}
      {modalAbierto && (
        <div style={s.overlay} onClick={() => { setModalAbierto(false); setMensaje('') }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            {enviado ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '700', color: '#1C1C1E' }}>Mensaje enviado</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>Te responderemos en menos de 24 horas.</p>
              </div>
            ) : (
              <>
                <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: '700', color: '#1C1C1E' }}>Enviar mensaje</h2>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#888' }}>
                  Cuéntanos tu duda o problema y te ayudaremos lo antes posible.
                </p>
                <textarea
                  placeholder="Escribe tu mensaje aquí..."
                  value={mensaje}
                  onChange={e => setMensaje(e.target.value)}
                  rows={5}
                  style={s.textarea}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                  <button onClick={() => { setModalAbierto(false); setMensaje('') }} style={s.btnCancelar}>Cancelar</button>
                  <button
                    onClick={handleEnviar}
                    disabled={!mensaje.trim() || enviando}
                    style={{ ...s.btnEnviar, opacity: !mensaje.trim() ? 0.5 : 1 }}
                  >
                    {enviando ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  root: { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  main: { flex: 1, overflowY: 'auto', padding: '2rem 1.25rem' },
  inner: { maxWidth: 700, margin: '0 auto' },
  titulo: { margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo: { margin: 0, fontSize: '0.9rem', color: '#888' },
  section: { backgroundColor: '#fff', borderRadius: '14px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1rem' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1rem', fontWeight: '700', color: '#1C1C1E' },
  btnContacto: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.25rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', border: 'none', backgroundColor: NARANJA, color: '#fff' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#fff', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '480px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' },
  textarea: { width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid #e8e8e8', fontSize: '0.9rem', outline: 'none', resize: 'none', fontFamily: 'inherit', color: '#1C1C1E', boxSizing: 'border-box' },
  btnCancelar: { flex: 1, padding: '0.85rem', backgroundColor: '#f5f5f5', color: '#888', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer' },
  btnEnviar: { flex: 1, padding: '0.85rem', backgroundColor: NARANJA, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
}