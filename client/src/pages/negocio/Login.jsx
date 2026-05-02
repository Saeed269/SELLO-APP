import { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, Link } from 'react-router-dom'

const pasos = [
  { num: '1', titulo: 'El negocio se registra', desc: 'Crea tu cuenta y configura tu tarjeta de fidelización en minutos' },
  { num: '2', titulo: 'El cliente escanea el QR', desc: 'Tu cliente escanea el QR del negocio desde su móvil' },
  { num: '3', titulo: 'Se genera la tarjeta', desc: 'El cliente recibe su tarjeta digital y comienza a acumular sellos' },
  { num: '4', titulo: 'Fideliza a tus clientes', desc: 'Cada visita cuenta — construye lealtad con tu programa de sellos' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)
  const [passFocus, setPassFocus] = useState(false)
  const [isMobile] = useState(window.innerWidth < 1024)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email o contraseña incorrectos') }
    else { navigate('/negocio/dashboard') }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Panel izquierdo */}
      {!isMobile && (
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 40%, #dc2626 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', padding: '3rem',
        }}>
          <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -100, right: -100 }} />
          <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -60, left: -60 }} />

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 520 }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1 style={{ margin: '0 0 1rem', fontSize: '3rem', fontWeight: '900', color: '#fff', letterSpacing: '0.1em' }}>SELLO</h1>
              <p style={{ margin: 0, color: '#fed7aa', fontSize: '0.95rem' }}>Fidelización digital para tu negocio</p>
            </div>

            {/* Pasos */}
            <p style={{ margin: '0 0 1rem', color: '#fff', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center' }}>¿Cómo funciona?</p>
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
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f97316', margin: 0, letterSpacing: '0.1em' }}>SELLO</h1>
          </div>
        )}

        <div style={{
          width: '100%', maxWidth: '420px',
          backgroundColor: '#fff', borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.9rem', fontWeight: '800', color: '#111827' }}>Bienvenido</h2>
          <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#6B7280' }}>Inicia sesión para gestionar tu negocio</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Correo electrónico</label>
              <input
                type="email" placeholder="tu@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)}
                style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: emailFocus ? '2px solid #f97316' : '1.5px solid #E5E7EB', fontSize: '0.92rem', outline: 'none', backgroundColor: '#fff', color: '#111827', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                required
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151' }}>Contraseña</label>
                <span style={{ fontSize: '0.78rem', color: '#f97316', cursor: 'pointer', fontWeight: '500' }}>¿Olvidaste tu contraseña?</span>
              </div>
              <input
                type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setPassFocus(true)} onBlur={() => setPassFocus(false)}
                style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: passFocus ? '2px solid #f97316' : '1.5px solid #E5E7EB', fontSize: '0.92rem', outline: 'none', backgroundColor: '#fff', color: '#111827', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                required
              />
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

            <button
              type="submit" disabled={loading}
              style={{ padding: '0.9rem', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(249,115,22,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading ? 'Entrando...' : <>Entrar <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#6B7280' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/negocio/register" style={{ color: '#f97316', fontWeight: '700', textDecoration: 'none' }}>Regístrate gratis</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.6 }}>
          Al continuar, aceptas nuestros{' '}
          <span style={{ color: '#f97316', cursor: 'pointer' }}>Términos de Servicio</span>
          {' '}y{' '}
          <span style={{ color: '#f97316', cursor: 'pointer' }}>Política de Privacidad</span>
        </p>
      </div>

    </div>
  )
}