import { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, Link } from 'react-router-dom'

const pasos = [
  { num: '1', titulo: 'Crea tu cuenta', desc: 'Registra tu negocio en menos de 3 minutos' },
  { num: '2', titulo: 'Diseña tu tarjeta', desc: 'Elige el diseño y personaliza tu programa de sellos' },
  { num: '3', titulo: 'Comparte el QR', desc: 'Tus clientes escanean e inmediatamente empiezan a acumular' },
  { num: '4', titulo: 'Fideliza y premia', desc: 'Analiza el uso y crea una base de clientes leales' },
]

export default function Register() {
  const [nombreNegocio, setNombreNegocio] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [nombreFocus, setNombreFocus] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)
  const [passFocus, setPassFocus] = useState(false)
  const [confirmFocus, setConfirmFocus] = useState(false)
  const [isMobile] = useState(window.innerWidth < 1024)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) { setError('Error al registrarse: ' + signUpError.message); setLoading(false); return }
    if (data?.user) {
  const token = data.session?.access_token
  if (token) {
    const { negociosApi } = await import('../../api')
    await negociosApi.create(token, { user_id: data.user.id, email, nombre: nombreNegocio })
  }
}
navigate('/negocio/onboarding')
    setLoading(false)
  }

  const inputStyle = (focused) => ({
    padding: '0.85rem 1rem', borderRadius: '12px',
    border: focused ? '2px solid #E65100' : '1.5px solid #E5E7EB',
    fontSize: '0.92rem', outline: 'none', backgroundColor: '#fff',
    color: '#111827', width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  })

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Panel izquierdo */}
      {!isMobile && (
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #E65100 0%, #bf360c 40%, #d4380a 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', padding: '3rem',
        }}>
          <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -100, right: -100 }} />
          <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -60, left: -60 }} />

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 520 }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1 style={{ margin: '0 0 1rem', fontSize: '3rem', fontWeight: '900', color: '#fff', letterSpacing: '0.1em' }}>SELLO</h1>
              <p style={{ margin: 0, color: '#fed7aa', fontSize: '0.95rem' }}>Empieza gratis en menos de 3 minutos</p>
            </div>

            <p style={{ margin: '0 0 1rem', color: '#fff', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center' }}>Cómo empezar</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pasos.map((p) => (
                <div key={p.num} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
                  borderRadius: '12px', padding: '0.75rem 1rem',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff' }}>{p.num}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{p.titulo}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#fed7aa' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ margin: '2rem 0 0', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>© 2026 SELLO. Todos los derechos reservados.</p>
          </div>
        </div>
      )}

      {/* Panel derecho */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', backgroundColor: '#f9fafb',
      }}>
        {isMobile && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#E65100', margin: 0, letterSpacing: '0.1em' }}>SELLO</h1>
          </div>
        )}

        <div style={{
          width: '100%', maxWidth: '420px',
          backgroundColor: '#fff', borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
        }}>
          <Link to="/negocio/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.25rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver
          </Link>

          <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.9rem', fontWeight: '800', color: '#111827' }}>Crear cuenta</h2>
          <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#6B7280' }}>Comienza a fidelizar tus clientes hoy</p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Nombre de tu negocio</label>
              <input type="text" placeholder="Mi Cafetería" value={nombreNegocio} onChange={e => setNombreNegocio(e.target.value)} onFocus={() => setNombreFocus(true)} onBlur={() => setNombreFocus(false)} style={inputStyle(nombreFocus)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Correo electrónico</label>
              <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)} style={inputStyle(emailFocus)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Contraseña (mínimo 6 caracteres)</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setPassFocus(true)} onBlur={() => setPassFocus(false)} style={inputStyle(passFocus)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Confirmar contraseña</label>
              <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} onFocus={() => setConfirmFocus(true)} onBlur={() => setConfirmFocus(false)} style={inputStyle(confirmFocus)} required />
            </div>

            {error && <p style={{ color: '#d4380a', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

            <button
              type="submit" disabled={loading}
              style={{ padding: '0.9rem', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #E65100, #bf360c)', color: '#fff', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(249,115,22,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading ? 'Creando cuenta...' : <>Crear cuenta gratis <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#6B7280' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/negocio/login" style={{ color: '#E65100', fontWeight: '700', textDecoration: 'none' }}>Inicia sesión</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.6 }}>
          Al registrarte, aceptas nuestros{' '}
          <Link to="/terminos" style={{ color: '#E65100', textDecoration: 'none' }}>Términos de Servicio</Link>
          {' '}y{' '}
          <Link to="/privacidad" style={{ color: '#E65100', textDecoration: 'none' }}>Política de Privacidad</Link>
        </p>
      </div>

    </div>
  )
}