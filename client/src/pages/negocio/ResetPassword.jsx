import { useState } from 'react'
import { supabase } from '../../supabase'
import { Link } from 'react-router-dom'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://sello-app-git-main-sello2.vercel.app/negocio/update-password',
    })
    if (error) { setError('Error al enviar el email: ' + error.message) }
    else { setEnviado(true) }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', fontFamily: 'Inter, system-ui, sans-serif', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', borderRadius: '24px', padding: '2.5rem 2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>

        <Link to="/negocio/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#6B7280', textDecoration: 'none', marginBottom: '1.25rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </Link>

        {enviado ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>Email enviado</h2>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.6 }}>
              Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
            </p>
            <Link to="/negocio/login" style={{ display: 'block', padding: '0.9rem', backgroundColor: '#E65100', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>Recuperar contraseña</h2>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#6B7280' }}>Te enviaremos un enlace para restablecer tu contraseña</p>

            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Correo electrónico</label>
                <input
                  type="email" placeholder="tu@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)}
                  style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: emailFocus ? '2px solid #E65100' : '1.5px solid #E5E7EB', fontSize: '0.92rem', outline: 'none', backgroundColor: '#fff', color: '#111827', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                  required
                />
              </div>

              {error && <p style={{ color: '#d4380a', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

              <button type="submit" disabled={loading} style={{ padding: '0.9rem', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #E65100, #bf360c)', color: '#fff', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(230,81,0,0.35)' }}>
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}