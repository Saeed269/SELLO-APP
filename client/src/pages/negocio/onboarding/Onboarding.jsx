import { useState } from 'react'
import { supabase } from '../../../supabase'
import { useNavigate } from 'react-router-dom'

const TIPOS_NEGOCIO = [
    'Peluquería / Barbería',
    'Salón de belleza',
    'Cafetería / Restaurante',
    'Gimnasio / Entrenador personal',
    'Centro de yoga / Pilates',
    'Farmacia',
    'Lavandería',
    'Otro',
]

export default function Onboarding() {
    const [paso, setPaso] = useState(1)
    const [nombre, setNombre] = useState('')
    const [tipo, setTipo] = useState('')
    const [numSellos, setNumSellos] = useState(10)
    const [premio, setPremio] = useState('')
    const [caducidad, setCaducidad] = useState(12)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleGuardar = async () => {
        setError('')
        if (!nombre || !tipo || !premio) {
            setError('Por favor rellena todos los campos')
            return
        }
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await supabase.from('negocios').insert({
            user_id: user.id,
            email: user.email,
            nombre,
            tipo,
            num_sellos: numSellos,
            premio,
            caducidad_meses: caducidad,
        })

        if (error) {
            setError('Error al guardar: ' + error.message)
            setLoading(false)
        } else {
            navigate('/negocio/dashboard')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.logo}>SELLO</h1>
                <p style={styles.subtitle}>Configura tu tarjeta de sellos</p>

                <div style={styles.pasos}>
                    {[1, 2, 3].map(p => (
                        <div key={p} style={{
                            ...styles.paso,
                            backgroundColor: paso >= p ? '#E8763A' : '#e0e0e0'
                        }} />
                    ))}
                </div>

                {paso === 1 && (
                    <div style={styles.seccion}>
                        <h2 style={styles.h2}>Tu negocio</h2>
                        <label style={styles.label}>Nombre del negocio</label>
                        <input
                            type="text"
                            placeholder="Ej: Barbería El Rincón"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            style={styles.input}
                        />
                        <label style={styles.label}>Tipo de negocio</label>
                        <select
                            value={tipo}
                            onChange={e => setTipo(e.target.value)}
                            style={styles.input}
                        >
                            <option value="">Selecciona un tipo...</option>
                            {TIPOS_NEGOCIO.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <button
                            style={styles.button}
                            onClick={() => {
                                if (!nombre || !tipo) {
                                    setError('Rellena el nombre y el tipo de negocio')
                                    return
                                }
                                setError('')
                                setPaso(2)
                            }}
                        >
                            Siguiente →
                        </button>
                    </div>
                )}

                {paso === 2 && (
                    <div style={styles.seccion}>
                        <h2 style={styles.h2}>Tu tarjeta de sellos</h2>
                        <label style={styles.label}>
                            Número de sellos para el premio: <strong style={{ color: '#E8763A' }}>{numSellos}</strong>
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="20"
                            value={numSellos}
                            onChange={e => setNumSellos(Number(e.target.value))}
                            style={{ width: '100%', marginBottom: '1.5rem' }}
                        />
                        <label style={styles.label}>¿Qué gana el cliente?</label>
                        <input
                            type="text"
                            placeholder="Ej: 1 corte de pelo gratis"
                            value={premio}
                            onChange={e => setPremio(e.target.value)}
                            style={styles.input}
                        />
                        <label style={styles.label}>
                            Caducidad de los sellos: <strong style={{ color: '#E8763A' }}>{caducidad} meses</strong>
                        </label>
                        <input
                            type="range"
                            min="6"
                            max="24"
                            value={caducidad}
                            onChange={e => setCaducidad(Number(e.target.value))}
                            style={{ width: '100%', marginBottom: '1.5rem' }}
                        />
                        <div style={styles.botones}>
                            <button style={styles.buttonSecondary} onClick={() => setPaso(1)}>← Atrás</button>
                            <button style={styles.button} onClick={() => {
                                if (!premio) {
                                    setError('Define el premio para tu cliente')
                                    return
                                }
                                setError('')
                                setPaso(3)
                            }}>Siguiente →</button>
                        </div>
                    </div>
                )}

                {paso === 3 && (
                    <div style={styles.seccion}>
                        <h2 style={styles.h2}>Resumen</h2>
                        <div style={styles.resumen}>
                            <div style={styles.resumenFila}>
                                <span style={styles.resumenLabel}>Negocio</span>
                                <span style={styles.resumenValor}>{nombre}</span>
                            </div>
                            <div style={styles.resumenFila}>
                                <span style={styles.resumenLabel}>Tipo</span>
                                <span style={styles.resumenValor}>{tipo}</span>
                            </div>
                            <div style={styles.resumenFila}>
                                <span style={styles.resumenLabel}>Sellos para premio</span>
                                <span style={styles.resumenValor}>{numSellos}</span>
                            </div>
                            <div style={styles.resumenFila}>
                                <span style={styles.resumenLabel}>Premio</span>
                                <span style={styles.resumenValor}>{premio}</span>
                            </div>
                            <div style={styles.resumenFila}>
                                <span style={styles.resumenLabel}>Caducidad</span>
                                <span style={styles.resumenValor}>{caducidad} meses</span>
                            </div>
                        </div>
                        {error && <p style={styles.error}>{error}</p>}
                        <div style={styles.botones}>
                            <button style={styles.buttonSecondary} onClick={() => setPaso(2)}>← Atrás</button>
                            <button style={styles.button} onClick={handleGuardar} disabled={loading}>
                                {loading ? 'Guardando...' : 'Crear mi tarjeta ✓'}
                            </button>
                        </div>
                    </div>
                )}

                {error && paso !== 3 && <p style={styles.error}>{error}</p>}
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
        padding: '2rem 1rem',
    },
    card: {
        backgroundColor: '#fff',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '480px',
    },
    logo: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#E8763A',
        textAlign: 'center',
        margin: '0 0 0.25rem 0',
    },
    subtitle: {
        textAlign: 'center',
        color: '#888',
        marginBottom: '1.5rem',
        fontSize: '0.95rem',
    },
    pasos: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
    },
    paso: {
        flex: 1,
        height: '4px',
        borderRadius: '2px',
        transition: 'background-color 0.3s',
    },
    seccion: {
        display: 'flex',
        flexDirection: 'column',
    },
    h2: {
        fontSize: '1.2rem',
        color: '#1C1C1E',
        marginBottom: '1.2rem',
    },
    label: {
        fontSize: '0.9rem',
        color: '#555',
        marginBottom: '0.4rem',
        fontWeight: '500',
    },
    input: {
        padding: '0.85rem 1rem',
        borderRadius: '8px',
        border: '1.5px solid #e0e0e0',
        fontSize: '1rem',
        marginBottom: '1.2rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
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
        flex: 1,
    },
    buttonSecondary: {
        padding: '0.85rem',
        backgroundColor: 'transparent',
        color: '#E8763A',
        border: '1.5px solid #E8763A',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        flex: 1,
    },
    botones: {
        display: 'flex',
        gap: '1rem',
        marginTop: '0.5rem',
    },
    resumen: {
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        padding: '1.2rem',
        marginBottom: '1.5rem',
    },
    resumenFila: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid #eee',
    },
    resumenLabel: {
        color: '#888',
        fontSize: '0.9rem',
    },
    resumenValor: {
        color: '#1C1C1E',
        fontWeight: '600',
        fontSize: '0.9rem',
    },
    error: {
        color: '#dc2626',
        fontSize: '0.9rem',
        marginTop: '0.5rem',
    },
}