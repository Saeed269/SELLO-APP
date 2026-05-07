import { Link, useNavigate } from 'react-router-dom'

const NARANJA = '#E65100'

export default function Privacidad() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#f9fafb', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.25rem' }}>

        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: NARANJA, letterSpacing: '0.08em' }}>SELLO</h1>
          <button onClick={() => navigate(-1)} style={{ fontSize: '0.85rem', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← Volver</button>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>Política de Privacidad</h2>
          <p style={{ margin: '0 0 2rem', fontSize: '0.82rem', color: '#9CA3AF' }}>Última actualización: mayo 2026</p>

          {[
            {
              titulo: '1. Responsable del tratamiento',
              texto: 'SELLO es responsable del tratamiento de los datos personales recogidos a través de esta plataforma. Puedes contactarnos en soporte@sello.app para cualquier consulta relacionada con el tratamiento de tus datos.'
            },
            {
              titulo: '2. Datos que recopilamos',
              texto: 'Recopilamos los siguientes datos: datos de registro del negocio (nombre, email, contraseña cifrada, teléfono, dirección), datos de los clientes del negocio (nombre, email), y datos de uso del programa de fidelización (sellos acumulados, premios canjeados, fecha de registro).'
            },
            {
              titulo: '3. Finalidad del tratamiento',
              texto: 'Utilizamos tus datos para: gestionar tu cuenta y el acceso a la plataforma, proporcionar el servicio de fidelización digital, enviarte comunicaciones relacionadas con el servicio, y mejorar la plataforma a través del análisis de uso.'
            },
            {
              titulo: '4. Base legal',
              texto: 'El tratamiento de tus datos se basa en: la ejecución del contrato de servicio aceptado al registrarte, el cumplimiento de obligaciones legales, y el interés legítimo de SELLO en mejorar sus servicios. Para el envío de comunicaciones comerciales, nos basamos en tu consentimiento.'
            },
            {
              titulo: '5. Conservación de datos',
              texto: 'Conservamos tus datos mientras mantengas una cuenta activa en SELLO. Tras la eliminación de la cuenta, los datos se eliminan permanentemente en un plazo máximo de 30 días, salvo que la legislación aplicable exija su conservación por un período mayor.'
            },
            {
              titulo: '6. Compartición de datos',
              texto: 'No vendemos ni compartimos tus datos personales con terceros con fines comerciales. Podemos compartir datos con proveedores de servicios técnicos necesarios para el funcionamiento de la plataforma (como servicios de alojamiento y autenticación), siempre bajo estrictos acuerdos de confidencialidad.'
            },
            {
              titulo: '7. Tus derechos',
              texto: 'De acuerdo con el RGPD, tienes derecho a: acceder a tus datos personales, rectificar datos inexactos, solicitar la eliminación de tus datos, oponerte al tratamiento, solicitar la limitación del tratamiento, y solicitar la portabilidad de tus datos. Para ejercer estos derechos, contáctanos en soporte@sello.app.'
            },
            {
              titulo: '8. Seguridad',
              texto: 'Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Las contraseñas se almacenan cifradas y nunca en texto plano.'
            },
            {
              titulo: '9. Cookies',
              texto: 'SELLO utiliza cookies técnicas necesarias para el funcionamiento de la plataforma, como las cookies de sesión para mantener tu inicio de sesión. No utilizamos cookies de seguimiento ni publicidad.'
            },
            {
              titulo: '10. Contacto y reclamaciones',
              texto: 'Para cualquier consulta sobre privacidad, contáctanos en soporte@sello.app. Si consideras que el tratamiento de tus datos no es adecuado, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).'
            },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: '700', color: '#111827' }}>{s.titulo}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: 1.7 }}>{s.texto}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: '#9CA3AF' }}>
          © 2026 SELLO. Todos los derechos reservados. ·{' '}
          <Link to="/terminos" style={{ color: NARANJA, textDecoration: 'none' }}>Términos de Servicio</Link>
        </p>
      </div>
    </div>
  )
}