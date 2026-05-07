import { Link, useNavigate } from 'react-router-dom'

const NARANJA = '#E65100'

export default function Terminos() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#f9fafb', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.25rem' }}>

        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: NARANJA, letterSpacing: '0.08em' }}>SELLO</h1>
          <button onClick={() => navigate(-1)} style={{ fontSize: '0.85rem', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← Volver</button>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>Términos de Servicio</h2>
          <p style={{ margin: '0 0 2rem', fontSize: '0.82rem', color: '#9CA3AF' }}>Última actualización: mayo 2026</p>

          {[
            {
              titulo: '1. Aceptación de los términos',
              texto: 'Al registrarte y utilizar SELLO, aceptas estos Términos de Servicio en su totalidad. Si no estás de acuerdo con alguno de los términos, no debes utilizar la plataforma. SELLO se reserva el derecho de modificar estos términos en cualquier momento, notificando los cambios a través de la plataforma o por email.'
            },
            {
              titulo: '2. Descripción del servicio',
              texto: 'SELLO es una plataforma digital de fidelización de clientes que permite a negocios crear y gestionar tarjetas de sellos digitales. Los negocios pueden registrarse, configurar su programa de fidelización y gestionar sus clientes a través de la plataforma.'
            },
            {
              titulo: '3. Registro y cuenta',
              texto: 'Para utilizar SELLO debes crear una cuenta proporcionando información veraz y actualizada. Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de todas las actividades que se realicen bajo tu cuenta. Debes notificarnos inmediatamente de cualquier uso no autorizado.'
            },
            {
              titulo: '4. Uso aceptable',
              texto: 'Te comprometes a utilizar SELLO únicamente para fines legales y de acuerdo con estos términos. Está prohibido: usar la plataforma para actividades fraudulentas, recopilar datos de usuarios sin consentimiento, intentar acceder a cuentas de otros usuarios, o utilizar la plataforma de forma que pueda dañar, deshabilitar o sobrecargar los servidores.'
            },
            {
              titulo: '5. Datos de clientes',
              texto: 'Como negocio usuario de SELLO, eres responsable de obtener el consentimiento necesario de tus clientes para recopilar y procesar sus datos personales a través de la plataforma. SELLO actúa como encargado del tratamiento de datos en tu nombre y procesará los datos de tus clientes únicamente según tus instrucciones.'
            },
            {
              titulo: '6. Plan de prueba y facturación',
              texto: 'SELLO ofrece un período de prueba gratuito para los primeros 30 clientes registrados. A partir de ese momento, será necesario contratar uno de los planes de pago disponibles para continuar utilizando el servicio. Los precios y condiciones de los planes pueden consultarse en la sección de ajustes de la plataforma.'
            },
            {
              titulo: '7. Limitación de responsabilidad',
              texto: 'SELLO no será responsable de ningún daño indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de uso del servicio. La responsabilidad total de SELLO no superará el importe pagado por el usuario en los últimos 12 meses.'
            },
            {
              titulo: '8. Cancelación y eliminación',
              texto: 'Puedes cancelar tu cuenta en cualquier momento desde la sección de Ajustes. Tras la cancelación, dispones de 30 días para solicitar la recuperación de tu cuenta. Pasado ese plazo, todos tus datos serán eliminados permanentemente.'
            },
            {
              titulo: '9. Legislación aplicable',
              texto: 'Estos términos se rigen por la legislación española. Cualquier disputa derivada del uso de SELLO será sometida a los tribunales competentes de España.'
            },
            {
              titulo: '10. Contacto',
              texto: 'Para cualquier consulta sobre estos términos, puedes contactarnos en soporte@sello.app.'
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
          <Link to="/privacidad" style={{ color: NARANJA, textDecoration: 'none' }}>Política de Privacidad</Link>
        </p>
      </div>
    </div>
  )
}