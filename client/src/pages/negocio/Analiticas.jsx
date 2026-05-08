import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import NavNegocio from '../../components/NavNegocio'
import LoadingScreen from '../../components/ui/LoadingScreen'
import { useAuth } from '../../hooks/useAuth'
import { COLORS } from '../../constants'

// ─── Helpers ──────────────────────────────────────────────────
function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// ─── Subcomponentes ───────────────────────────────────────────
function StatCard({ label, valor, icon, color, isMobile }) {
  return (
    <div style={{ ...s.statCard, textAlign: isMobile ? 'center' : 'left', justifyContent: isMobile ? 'center' : 'flex-start' }}>
      {!isMobile && (
        <div style={{ ...s.iconWrap, backgroundColor: `${color}18` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </div>
      )}
      <div>
        <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' }}>{valor}</p>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>{label}</p>
      </div>
    </div>
  )
}

function GraficaActividad({ datos, maxSellos }) {
  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>Actividad últimos 30 días</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '120px', padding: '0 0 8px' }}>
        {datos.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{
              width: '100%',
              backgroundColor: d.sellos > 0 ? COLORS.primary : '#f0f0f0',
              borderRadius: '3px 3px 0 0',
              height: `${Math.max((d.sellos / maxSellos) * 100, d.sellos > 0 ? 8 : 4)}%`,
              minHeight: '4px',
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', color: '#bbb' }}>{formatFecha(datos[0]?.dia)}</p>
        <p style={{ margin: 0, fontSize: '0.7rem', color: '#bbb' }}>{formatFecha(datos[datos.length - 1]?.dia)}</p>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────
export default function Analiticas() {
  const { user, negocio, loading } = useAuth()
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768)
  const [dataLoading, setDataLoading] = useState(true)
  const [stats, setStats]         = useState({ clientesActivosMes: 0, premiosCanjeados: 0, tasaRetorno: 0 })
  const [habituales, setHabituales] = useState([])
  const [enRiesgo, setEnRiesgo]   = useState([])
  const [actividad, setActividad] = useState([])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!negocio) return

    const fetchData = async () => {
      const { data: tarjetas } = await supabase
        .from('tarjetas').select('*').eq('negocio_id', negocio.id)

      if (!tarjetas || tarjetas.length === 0) { setDataLoading(false); return }

      const clienteIds = tarjetas.map(t => t.cliente_id)
      const { data: clientes } = await supabase
        .from('clientes').select('id, nombre, email').in('id', clienteIds)
      const clientesMap = {}
      clientes?.forEach(c => { clientesMap[c.id] = c })

      const ahora     = new Date()
      const hace30d   = new Date(ahora - 30 * 24 * 60 * 60 * 1000)
      const total     = tarjetas.length
      const canjeados = tarjetas.reduce((sum, t) => sum + (t.total_canjes || 0), 0)
      const activos   = tarjetas.filter(t => t.updated_at && new Date(t.updated_at) > hace30d).length
      const conRetorno = tarjetas.filter(t => (t.total_canjes || 0) > 0 || t.sellos_actuales > 1).length

      setStats({
        clientesActivosMes: activos,
        premiosCanjeados:   canjeados,
        tasaRetorno:        total > 0 ? Math.round((conRetorno / total) * 100) : 0,
      })

      setHabituales(
        [...tarjetas]
          .map(t => ({ ...t, cliente: clientesMap[t.cliente_id], score: (t.total_canjes || 0) * 10 + (t.sellos_actuales || 0) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
      )

      setEnRiesgo(
        tarjetas
          .filter(t => t.sellos_actuales > 0 && t.updated_at && new Date(t.updated_at) < hace30d)
          .map(t => ({ ...t, cliente: clientesMap[t.cliente_id] }))
          .slice(0, 5)
      )

      const dias = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(ahora)
        d.setDate(d.getDate() - (29 - i))
        return d.toISOString().split('T')[0]
      })
      const porDia = {}
      dias.forEach(d => { porDia[d] = 0 })
      tarjetas.forEach(t => {
        if (t.updated_at) {
          const dia = t.updated_at.split('T')[0]
          if (porDia[dia] !== undefined) porDia[dia]++
        }
      })
      setActividad(dias.map(d => ({ dia: d, sellos: porDia[d] })))
      setDataLoading(false)
    }

    fetchData()
  }, [negocio])

  if (loading || dataLoading) return <LoadingScreen />

  const maxActividad = Math.max(...actividad.map(d => d.sellos), 1)

  return (
    <div style={s.root}>
      <NavNegocio negocio={negocio} user={user} />
      <main style={s.main}>
        <div style={s.inner}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={s.titulo}>Analíticas</h1>
            <p style={s.subtitulo}>Resumen de actividad de tu programa de fidelización</p>
          </div>

          <div style={{ ...s.cardsGrid, gridTemplateColumns: isMobile ? 'repeat(3,1fr)' : 'repeat(auto-fit,minmax(180px,1fr))' }}>
            <StatCard label="Clientes activos"   valor={stats.clientesActivosMes} icon="M22 12h-4l-3 9L9 3l-3 9H2"                                                                               color={COLORS.primary} isMobile={isMobile} />
            <StatCard label="Premios canjeados"  valor={stats.premiosCanjeados}   icon="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" color="#FFD700"        isMobile={isMobile} />
            <StatCard label="Tasa de retorno"    valor={`${stats.tasaRetorno}%`}  icon="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"                          color={COLORS.success} isMobile={isMobile} />
          </div>

          {actividad.length > 0 && <GraficaActividad datos={actividad} maxSellos={maxActividad} />}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Clientes más habituales</h2>
              {habituales.length === 0 ? (
                <p style={{ color: '#888', fontSize: '0.85rem' }}>Sin datos aún</p>
              ) : habituales.map((t, i) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#bbb', width: '16px', flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600', color: '#1C1C1E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.cliente?.nombre || 'Sin nombre'}</p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#888' }}>{t.sellos_actuales} sellos · {t.total_canjes || 0} canjes</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={s.section}>
              <h2 style={s.sectionTitle}>Clientes en riesgo</h2>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#888' }}>Sin actividad en más de 30 días</p>
              {enRiesgo.length === 0 ? (
                <p style={{ color: '#888', fontSize: '0.85rem' }}>¡Todos tus clientes están activos!</p>
              ) : enRiesgo.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
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
          </div>
        </div>
      </main>
    </div>
  )
}

const s = {
  root:         { display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f5f5' },
  main:         { flex: 1, overflowY: 'auto', padding: '2rem 1.25rem' },
  inner:        { maxWidth: 900, margin: '0 auto' },
  titulo:       { margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '700', color: '#1C1C1E' },
  subtitulo:    { margin: 0, fontSize: '0.9rem', color: '#888' },
  cardsGrid:    { display: 'grid', gap: '12px', marginBottom: '1.25rem' },
  statCard:     { backgroundColor: '#fff', borderRadius: '14px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  iconWrap:     { width: 44, height: 44, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  section:      { backgroundColor: '#fff', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1rem' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1rem', fontWeight: '700', color: '#1C1C1E' },
}