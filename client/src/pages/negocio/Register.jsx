import { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
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
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError('Error al registrarse: ' + error.message)
    } else {
      navigate('/negocio/dashboard')
    }
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
            <div style={styles.logoWrap}>
              <span style={styles.logoLetter}>S</span>
            </div>
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
              <div style={{ ...styles.logoWrap, margin: '0 auto 0.75rem', background: '#E8763A' }}>
                <span style={styles.logoLetter}>S</span>
              </div>
              <h1 style={{ ...styles.logoText, color: '#E8763A', fontSize: '1.8rem' }}>SELLO</h1>
              <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Crea tu cuenta gratis</p>
            </div>
          )}

          <h2 style={styles.titulo}>Crear cuenta</h2>
          <p style={styles.subtitulo}>Configura tu negocio en menos de 5 minutos</p>

          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.campo}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="tu@negocio.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="Repite la contraseña"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={styles.input}
                required
              />
            </div>

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
    backgroundColor: '#f5f5f5',
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
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  logoLetter: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  logoText: {
    margin: '0 0 0.5rem',
    fontSize: '2.2rem',
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: '0.1em',
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
    backgroundColor: '#fff',
  },
  formWrap: {
    width: '100%',
    maxWidth: '400px',
  },
  titulo: {
    margin: '0 0 0.35rem',
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#1C1C1E',
  },
  subtitulo: {
    margin: '0 0 2rem',
    fontSize: '0.9rem',
    color: '#888',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#444',
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1.5px solid #e0e0e0',
    fontSize: '0.95rem',
    outline: 'none',
    backgroundColor: '#fafafa',
    color: '#1C1C1E',
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
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    letterSpacing: '0.02em',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: '#888',
  },
  link: {
    color: '#E8763A',
    fontWeight: '600',
    textDecoration: 'none',
  },
}