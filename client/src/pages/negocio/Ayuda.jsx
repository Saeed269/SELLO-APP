import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavNegocio from '../../components/NavNegocio'

const NARANJA = '#E8763A'

const FAQS = [
  {
    pregunta: '¿Cómo añado un sello a un cliente?',
    respuesta: 'Hay dos formas: escanea el QR del cliente desde el Dashboard pulsando "Escanear QR del Cliente", o ve a la sección Clientes, busca al cliente y pulsa "+ Añadir Sello".',
  },
  {
    pregunta: '¿Cómo se registra un nuevo cliente?',
    respuesta: 'El cliente escanea el QR de tu negocio (visible en el Dashboard), crea una cuenta y su tarjeta se genera automáticamente.',
  },
  {
    pregunta: '¿Cómo canjeo el premio de un cliente?',
    respuesta: 'Cuando un cliente completa su tarjeta, escanea su QR desde el escáner y serás redirigido automáticamente a la pantalla de canje. Confirma el canje y la tarjeta vuelve a 0.',
  },
  {
    pregunta: '¿Puedo cambiar el número de sellos o el premio?',
    respuesta: 'Sí, ve a Mi Tarjeta → Configuración y modifica los sellos, el premio o la caducidad. Los cambios se aplican inmediatamente.',
  },
  {
    pregunta: '¿Qué pasa cuando caduca una tarjeta?',
    respuesta: 'Cuando los sellos de un cliente caducan, su contador vuelve a 0 automáticamente según el período de caducidad que hayas configurado.',
  },
  {
    pregunta: '¿Puedo personalizar el diseño de la tarjeta?',
    respuesta: 'Sí, en Mi Tarjeta → Diseño puedes cambiar el estilo, el color, el efecto decorativo y los iconos de sello y premio.',
  },
  {
    pregunta: '¿Los clientes necesitan descargar una app?',
    respuesta: 'No. SELLO es una PWA — los clientes acceden desde el navegador escaneando tu QR. Pueden guardarla en su pantalla de inicio como si fuera una app.',
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
        <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#555', lineHeight: 1.6 }}>{respuesta}</p>
      )}
    </div>
  )
}

export default function Ayuda() {
  const navigate = useNavigate()

  return (
    <div style={s.root}>
      <NavNegocio />

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
              Si no encuentras la respuesta que buscas, contacta con nuestro equipo de soporte. Respondemos en menos de 24 horas.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href="mailto:soporte@sello.app"
                style={{ ...s.btnContacto, backgroundColor: NARANJA, color: '#fff', textDecoration: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Enviar email
              </a>
              <a
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noreferrer"
                style={{ ...s.btnContacto, backgroundColor: '#25D366', color: '#fff', textDecoration: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

        </div>
      </main>
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
  btnContacto: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.25rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', border: 'none' },
}