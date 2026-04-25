import { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [nombreNegocio, setNombreNegocio] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError('Error al registrarse: ' + signUpError.message)
      setLoading(false)
      return
    }

    // Guardar nombre del negocio en la tabla negocios
    if (data?.user) {
      await supabase.from('negocios').insert({
        user_id: data.user.id,
        email,
        nombre: nombreNegocio,
      })
    }

    navigate('/negocio/onboarding')
    setLoading(false)
  }

  return (
    <div style={styles.root}>

      {/* Panel izquierdo — naranja */}
      {!isMobile && (
        <div style={styles.left}>
          <div style={styles.leftBlob1} />
          <div style={styles.leftBlob2} />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h1 style={styles.logoText}>SELLO</h1>
            <p style={styles.tagline}>Empieza gratis en menos de 5 minutos</p>
            <div style={styles.pasos}>
              <div style={styles.paso}>
                <span style={styles.pasoNum}>1</span>
                <span style={styles.pasoLabel}>Crea tu cuenta</span>
              </div>
              <div style={styles.paso}>
                <span style={styles.pasoNum}>2</span>
                <span style={styles.pasoLabel}>Configura tu tarjeta</span>
              </div>
              <div style={styles.paso}>
                <span style={styles.pasoNum}>3</span>
                <span style={styles.pasoLabel}>Comparte el QR con tus clientes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel derecho — formulario */}
      <div style={styles.right}>
        <div style={styles.formWrap}>

          {/* Logo mobile */}
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ ...styles.logoText, color: '#E8763A', fontSize: '2rem', margin: '0 0 0.5rem' }}>SELLO</h1>
              <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Tu app de fidelización</p>
            </div>
          )}

          <h2 style={styles.titulo}>Crear cuenta</h2>
          <p style={styles.subtitulo}>Configura tu negocio en menos de 5 minutos</p>

          <form onSubmit={handleRegister} style={styles.form}>
            <input
              type="text"
              placeholder="Nombre de tu negocio"
              value={nombreNegocio}
              onChange={e => setNombreNegocio(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Contraseña (mínimo 6 caracteres)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              style={styles.input}
              required
            />

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p style={styles.linkText}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/negocio/login" style={styles.link}>Inicia sesión</Link>
          </p>
        </div>
      </div>

    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '3rem',
  },
  leftBlob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    top: -80,
    right: -80,
  },
  leftBlob2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.07)',
    bottom: -50,
    left: -50,
  },
  logoText: {
    margin: '0 0 0.75rem',
    fontSize: '2.8rem',
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: '0.12em',
  },
  tagline: {
    margin: '0 0 2rem',
    color: 'rgba(255,255,255,0.85)',
    fontSize: '1rem',
  },
  pasos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: 'rgba(255,255,255,0.12)',
    borderRadius: '14px',
    padding: '1.25rem 1.5rem',
    border: '1px solid rgba(255,255,255,0.2)',
    textAlign: 'left',
  },
  paso: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  pasoNum: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pasoLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.9rem',
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    backgroundColor: '#f9f9f9',
  },
  formWrap: {
    width: '100%',
    maxWidth: '360px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  },
  titulo: {
    margin: '0 0 0.35rem',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1C1C1E',
  },
  subtitulo: {
    margin: '0 0 1.75rem',
    fontSize: '0.88rem',
    color: '#888',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1.5px solid #e8e8e8',
    fontSize: '0.95rem',
    outline: 'none',
    backgroundColor: '#fafafa',
    color: '#1C1C1E',
    width: '100%',
    boxSizing: 'border-box',
  },
  error: {
    color: '#dc2626',
    fontSize: '0.85rem',
    margin: 0,
  },
  button: {
    padding: '0.9rem',
    backgroundColor: '#E8763A',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.25rem',
    width: '100%',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '1.25rem',
    fontSize: '0.88rem',
    color: '#888',
  },
  link: {
    color: '#E8763A',
    fontWeight: '600',
    textDecoration: 'none',
  },
}