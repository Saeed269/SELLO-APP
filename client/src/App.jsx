import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function App() {
  const [conexion, setConexion] = useState('Comprobando conexión...')

  useEffect(() => {
    async function probarConexion() {
      const { data, error } = await supabase.from('negocios').select('*')
      if (error) {
        setConexion('Error de conexión: ' + error.message)
      } else {
        setConexion('✅ Conexión con Supabase correcta')
      }
    }
    probarConexion()
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>SELLO</h1>
      <p>{conexion}</p>
    </div>
  )
}

export default App
