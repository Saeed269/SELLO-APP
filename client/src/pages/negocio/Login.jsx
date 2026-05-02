import { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, Link } from 'react-router-dom'

const pasos = [
  { num: '1', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', titulo: 'El negocio se registra', desc: 'Crea tu cuenta y configura tu tarjeta de fidelización en minutos' },
  { num: '2', icon: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10', titulo: 'El cliente escanea el QR', desc: 'Tu cliente escanea el QR del negocio desde su móvil' },
  { num: '3', icon: 'M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z M3 22v-1a9 9 0 0 1 18 0v1', titulo: 'Se genera la tarjeta', desc: 'El cliente recibe su tarjeta digital y comienza a acumular sellos' },
  { num: '4', icon: 'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z', titulo: 'Ganan haste el premio', desc: 'Acumula sellos en cada compra y consigue tu recompensa' },
]

function PasoCard({ paso, index }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        background: hover ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        borderRadius: '14px', padding: '0.85rem 1rem',
        border: '1px solid rgba(255,255,255,0.15)',
        transition: 'background 0.2s',
      }}
    >
      <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff' }}>{paso.num}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}>
          <path d={paso.icon} />
        </svg>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: '0.83rem', fontWeight: '700', color: '#fff' }}>{paso.titulo}</p>
          <p style={{ margin: 0, fontSize: '0.73rem', color: '#fed7aa', lineHeight: 1.5 }}>{paso.desc}</p>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
  const [btnActive, setBtnActive] = useState(false)
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
          width: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 40%, #dc2626 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', padding: '3rem 2.5rem',
        }}>
          <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -100, right: -100 }} />
          <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -60, left: -60 }} />

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
            <h1 style={{ margin: '0 0 0.25rem', fontSize: '3rem', fontWeight: '900', color: '#fff', letterSpacing: '0.08em' }}>SELLO</h1>
            <p style={{ margin: '0 0 2rem', color: '#fed7aa', fontSize: '0.92rem' }}>Fidelización digital para tu negocio</p>

            <h2 style={{ margin: '0 0 0.75rem', color: '#fff', fontSize: '1.1rem', fontWeight: '600' }}>¿Cómo funciona?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pasos.map((p, i) => <PasoCard key={p.num} paso={p} index={i} />)}
            </div>

            <p style={{ margin: '2rem 0 0', fontSize: '0.72rem', color: '#fed7aa' }}>© 2026 SELLO. Todos los derechos reservados.</p>
          </div>
        </div>
      )}

      {/* Panel derecho */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 3rem', backgroundColor: '#f9fafb',
      }}>
        {isMobile && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f97316', margin: 0, letterSpacing: '0.1em' }}>SELLO</h1>
          </div>
        )}

        {/* Card formulario */}
        <div style={{
          width: '100%', maxWidth: '400px',
          backgroundColor: '#fff', borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        }}>
          <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.9rem', fontWeight: '800', color: '#111827' }}>Bienvenido</h2>
          <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#6B7280' }}>Inicia sesión para gestionar tu negocio</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Correo electrónico</label>
              <input
                type="email" placeholder="tu@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                style={{
                  padding: '0.85rem 1rem', borderRadius: '12px',
                  border: emailFocus ? '2px solid #f97316' : '1.5px solid #E5E7EB',
                  fontSize: '0.92rem', outline: 'none', backgroundColor: '#fff',
                  color: '#111827', width: '100%', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '500', color: '#374151' }}>Contraseña</label>
                <span style={{ fontSize: '0.78rem', color: '#f97316', cursor: 'pointer', fontWeight: '500' }}>¿Olvidaste tu contraseña?</span>
              </div>
              <input
                type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
                style={{
                  padding: '0.85rem 1rem', borderRadius: '12px',
                  border: passFocus ? '2px solid #f97316' : '1.5px solid #E5E7EB',
                  fontSize: '0.92rem', outline: 'none', backgroundColor: '#fff',
                  color: '#111827', width: '100%', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                required
              />
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => { setBtnHover(false); setBtnActive(false) }}
              onMouseDown={() => setBtnActive(true)}
              onMouseUp={() => setBtnActive(false)}
              style={{
                padding: '0.9rem', border: 'none', borderRadius: '12px',
                background: btnHover ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff', fontSize: '0.95rem', fontWeight: '700',
                cursor: 'pointer', width: '100%', marginTop: '0.25rem',
                boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
                transform: btnActive ? 'scale(0.98)' : btnHover ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? 'Entrando...' : (
                <>
                  Entrar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#6B7280' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/negocio/register" style={{ color: '#f97316', fontWeight: '700', textDecoration: 'none' }}>Regístrate gratis</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.6 }}>
          Al continuar, aceptas nuestros{' '}
          <span style={{ color: '#f97316', cursor: 'pointer' }}>Términos de Servicio</span>
          {' '}y{' '}
          <span style={{ color: '#f97316', cursor: 'pointer' }}>Política de Privacidad</span>
        </p>
      </div>

    </div>
  )
}