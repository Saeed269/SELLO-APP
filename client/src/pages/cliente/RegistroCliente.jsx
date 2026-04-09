import { useState } from 'react'
import { supabase } from '../../supabase'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function RegistroCliente() {
    const [searchParams] = useSearchParams()
    const negocioId = searchParams.get('negocio')
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegistro = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // 1. Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (authError) {
            setError('Error al registrarse: ' + authError.message)
            setLoading(false)
            return
        }

        const userId = authData.user.id

        // 2. Guardar cliente en la tabla clientes
        const { data: clienteData, error: clienteError } = await supabase
            .from('clientes')
            .insert({ user_id: userId, nombre, email })
            .select()
            .single()

        if (clienteError) {
            setError('Error al guardar cliente: ' + clienteError.message)
            setLoading(false)
            return
        }

        // 3. Crear tarjeta usando el id de la tabla clientes
        const { error: tarjetaError } = await supabase.from('tarjetas').insert({
            cliente_id: clienteData.id,
            negocio_id: negocioId,
            sellos_actuales: 0,
        })

        if (tarjetaError) {
            setError('Error al crear tarjeta: ' + tarjetaError.message)
            setLoading(false)
            return
        }

        navigate(`/cliente/tarjeta?negocio=${negocioId}`)
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.logo}>SELLO</h1>
                <p style={styles.subtitle}>Crea tu cuenta para empezar a acumular sellos</p>

                <form onSubmit={handleRegistro} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
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
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Empezar a acumular sellos'}
                    </button>
                </form>

                <p style={styles.login}>
                    ¿Ya tienes cuenta?{' '}
                    <span
                        style={styles.loginLink}
                        onClick={() => navigate(`/cliente/login?negocio=${negocioId}`)}
                    >
                        Inicia sesión
                    </span>
                </p>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '1rem',
    },
    card: {
        backgroundColor: '#fff',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    logo: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#E8763A',
        textAlign: 'center',
        margin: '0 0 0.25rem 0',
    },
    subtitle: {
        textAlign: 'center',
        color: '#888',
        marginBottom: '2rem',
        fontSize: '0.9rem',
        lineHeight: '1.4',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    input: {
        padding: '0.85rem 1rem',
        borderRadius: '8px',
        border: '1.5px solid #e0e0e0',
        fontSize: '1rem',
        outline: 'none',
    },
    error: {
        color: '#dc2626',
        fontSize: '0.9rem',
        margin: 0,
    },
    button: {
        padding: '0.85rem',
        backgroundColor: '#E8763A',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '0.5rem',
    },
    login: {
        textAlign: 'center',
        marginTop: '1.5rem',
        fontSize: '0.9rem',
        color: '#555',
    },
    loginLink: {
        color: '#E8763A',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
}