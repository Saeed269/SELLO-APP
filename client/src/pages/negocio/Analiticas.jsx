import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import NavNegocio from '../../components/NavNegocio'

const NARANJA = '#E8763A'

export default function Analiticas() {
  const [user, setUser] = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClientes: 0,
    clientesActivosMes: 0,
    premiosCanjeados: 0,
    tasaRetorno: 0,
  })
  const [clientesHabituales, setClientesHabituales] = useState([])
  const [clientesRiesgo, setClientesRiesgo] = useState([])
  const [sellosUltimos30, setSellosUltimos30] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/negocio/login'); return }
      setUser(user)

      const { data: negocioData } = await supabase
        .from('negocios').select('*').eq('user_id', user.id).single()
      if (!negocioData) { navigate('/negocio/onboarding'); return }
      setNegocio(negocioData)

      // Obtener tarjetas
      const { data: tarjetas } = await supabase
        .from('tarjetas').select('*').eq('negocio_id', negocioData.id)

      if (!tarjetas || tarjetas.length === 0) {
        setLoading(false)
        return
      }

      // Obtener clientes
      const clienteIds = tarjetas.map(t => t.cliente_id)
      const { data: clientes } = await supabase
        .from('clientes').select('id, nombre, email').in('id', clienteIds)
      const clientesMap = {}
      clientes?.forEach(c => { clientesMap[c.id] = c })

      const ahora = new Date()
      const hace30dias = new Date(ahora - 30 * 24 * 60 * 60 * 1000)
      const hace7dias = new Date(ahora - 7 * 24 * 60 * 60 * 1000)

      // Stats
      const totalClientes = tarjetas.length
      const premiosCanjeados = tarjetas.reduce((sum, t) => sum + (t.total_canjes || 0), 0)
      const clientesActivosMes = tarjetas.filter(t =>
        t.updated_at && new Date(t.updated_at) > hace30dias
      ).length
      const clientesConMasDeUnaVisita = tarjetas.filter(t => (t.total_canjes || 0) > 0 || t.sellos_actuales > 1).length
      const tasaRetorno = totalClientes > 0 ? Math.round((clientesConMasDeUnaVisita / totalClientes) * 100) : 0

      setStats({ totalClientes, clientesActivosMes, premiosCanjeados, tasaRetorno })

      // Clientes habituales — ordenados por total_canjes + sellos_actuales
      const habituales = [...tarjetas]
        .map(t => ({ ...t, cliente: clientesMap[t.cliente_id], score: (t.total_canjes || 0) * 10 + (t.sellos_actuales || 0) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
      setClientesHabituales(habituales)

      // Clientes en riesgo — sin actividad en 30 días pero con algún sello
      const enRiesgo = tarjetas
        .filter(t => t.sellos_actuales > 0 && t.updated_at && new Date(t.updated_at) < hace30dias)
        .map(t => ({ ...t, cliente: clientesMap[t.cliente_id] }))
        .slice(0, 5)
      setClientesRiesgo(enRiesgo)

      // Sellos últimos 30 días — simulado con updated_at
      const dias = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(ahora)
        d.setDate(d.getDate() - (29 - i))
        return d.toISOString().split('T')[0]
      })
      const sellosPorDia = {}
      dias.forEach(d => { sellosPorDia[d] = 0 })
      tarjetas.forEach(t => {
        if (t.updated_at) {
          const dia = t.updated_at.split('T')[0]
          if (sellosPorDia[dia] !== undefined) sellosPorDia[dia]++
        }
      })
      setSellosUltimos30(dias.map(d => ({ dia: d, sellos: sellosPorDia[d] })))

      setLoading(false)
    }
    init()
  }, [navigate])

  const formatFecha = (fecha) => {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.12em' }}>SELLO</h1>
    </div>
  )

  const maxSellos = Math.max(...sellosUltimos30.map(d => d.sellos), 1)

  return (
    <div style={s.root}>
      <NavNegocio negocio={negocio} user={user} />

      <main style={s.main}>
        <div style={s.inner}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={s.titulo}>Analíticas</h1>
            <p style={s.subtitulo}>Resumen de actividad de tu programa de fidelización</p>
          </div>

          {/* Cards resumen */}
          <div style={{ ...s.cardsGrid, gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {[
              { label: 'Clientes activos', valor: stats.clientesActivosMes, icon: 'M22 12h-4l-3 9L9 3l-3 9H2', color: NARANJA },
              { label: 'Premios canjeados', valor: stats.premiosCanjeados, icon: 'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z', color: '#FFD700' },
              { label: 'Tasa de retorno', valor: `${stats.tasaRetorno}%`, icon: 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3', color: '#2D6A4F' },
            ].map(({ label, valor, icon, color }) => (
              <div key={label} style={{ ...s.statCard, textAlign: isMobile ? 'center' : 'left', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                {!isMobile && <div style={{ ...s.iconWrap, backgroundColor: `${color}18` }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                  </svg>
                </div>}
                <div>
                  <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' }}>{valor}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gráfica sellos últimos 30 días */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Actividad últimos 30 días</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '120px', padding: '0 0 8px' }}>
              {sellosUltimos30.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', backgroundColor: d.sellos > 0 ? NARANJA : '#f0f0f0', borderRadius: '3px 3px 0 0', height: `${Math.max((d.sellos / maxSellos) * 100, d.sellos > 0 ? 8 : 4)}%`, transition: 'height 0.3s', minHeight: '4px' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#bbb' }}>{formatFecha(sellosUltimos30[0]?.dia)}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#bbb' }}>{formatFecha(sellosUltimos30[sellosUltimos30.length - 1]?.dia)}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* Clientes habituales */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Clientes más habituales</h2>
              {clientesHabituales.length === 0 ? (
                <p style={{ color: '#888', fontSize: '0.85rem' }}>Sin datos aún</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {clientesHabituales.map((t, i) => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#bbb', width: '16px', flexShrink: 0 }}>{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600', color: '#1C1C1E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.cliente?.nombre || 'Sin nombre'}</p>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#888' }}>{t.sellos_actuales} sellos · {t.total_canjes || 0} canjes</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clientes en riesgo */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Clientes en riesgo</h2>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#888' }}>Sin actividad en más de 30 días</p>
              {clientesRiesgo.length === 0 ? (
                <p style={{ color: '#888', fontSize: '0.85rem' }}>¡Todos tus clientes están activos!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {clientesRiesgo.map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#888', fontWeight: '700', fontSize: '0.85rem' }}>{t.cliente?.nombre?.[0]?.toUpperCase() || '?'}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600', color: '#1C1C1E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.cliente?.nombre || 'Sin nombre'}</p>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#888' }}>Última visita: {formatFecha(t.updated_at)}</p>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#dc2626', backgroundColor: '#fee2e2', borderRadius: '20px', padding: '2px 8px', whiteSpace: 'nowrap' }}>En riesgo</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

const s = {
  root: { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  main: { flex: 1, overflowY: 'auto', padding: '2rem 1.25rem' },
  inner: { maxWidth: 900, margin: '0 auto' },
  titulo: { margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo: { margin: 0, fontSize: '0.9rem', color: '#888' },
  cardsGrid: { display: 'grid', gap: '12px', marginBottom: '1.25rem' },
  statCard: { backgroundColor: '#fff', borderRadius: '14px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'left' },
  iconWrap: { width: 44, height: 44, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  section: { backgroundColor: '#fff', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1rem' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1rem', fontWeight: '700', color: '#1C1C1E' },
}